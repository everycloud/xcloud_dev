
define(['tiny-lib/angular',
	"app/business/vdc/services/ajaxVPC"],

	function (angular, ajax) {
		"use strict";
		
		var ctrl = ["$scope", "$state", "fmLib", "$stateParams", function ($scope, $state, fmLib, $stateParams) {
			
			var i18n = $scope.i18n || {};
			
			$scope.lib = fmLib;
			
			$scope.step_status = 0;
			
			$scope.state = $stateParams;
			
			$scope.show = {
				check : false,
				txCfg : false,
				rxCfg : false,
				arpCfg : false,
				ipCfg : false,
				router : false,
				ext : false,
				disable: false
			}

			$scope.cancel = function () {
				$state.go("vdcMgr.network.list");
			};
			
			$scope.create = function () {
				var para = fillPara();
				if ($scope.state.vpc){
					ajax.net.modifyNet(para, 
						$scope.cancel, $scope.cancel);
				}else{
					ajax.net.createNet(para, 
						$scope.cancel, $scope.cancel);
				}
			};
			
			$scope.prev = function () {
				$scope.step_status--;
				$scope.$digest();
			};
			
			$scope.next = function () {
				if (!$scope.show.check){
					return;
				}
			
				$scope.step_status++;
				$scope.$digest();
			};
			
			$scope.label = {
				name : i18n.common_term_name_label||"名称",
				zone : i18n.resource_term_zone_label||"资源分区",
				az : i18n.resource_term_AZ_label||"可用分区",
				vpc : i18n.common_term_shareVPC_label||"共享VPC",
				desp : i18n.common_term_desc_label||"描述",
				type : i18n.common_term_type_label||"类型",
				net : i18n.resource_term_externalNet_label||"外部网络",
				vlan : "VLAN ID",
				vlanPool : i18n.resource_term_vlanPool_label||"VLAN池",
				ipAlloc : i18n.common_term_IPassignMode_label||"IP分配方式",
				ip : i18n.common_term_SubnetIP_label||"子网IP",
				mask : i18n.common_term_SubnetMask_label||"子网掩码",
				gateway : i18n.common_term_gateway_label||"网关",
				domain : i18n.common_term_domainName_label||"域名",
				dns1 : i18n.common_term_activeDNS_label||"首选DNS服务器",
				dns2 : i18n.common_term_standbyDNS_label||"备选DNS服务器",
				wins1 : i18n.common_term_activeWINS_label||"首选WINS服务器",
				wins2 : i18n.common_term_standbyWINS_label||"备选WINS服务器",
				ipRange : i18n.common_term_IPsegment_label||"可用IP段",
				txCfg : i18n.common_term_sendSpeedLimit_label||"发送限速",
				txAvg : i18n.perform_term_bandAvgMbps_label||"发送平均带宽",
				txMax : i18n.perform_term_bandPeakMbps_label||"发送峰值带宽",
				txBurst : i18n.common_term_gustyMbps_label||"发送突发大小",
				txPri : i18n.common_term_priority_label||"优先级",
				rxCfg : i18n.common_term_receiveSpeedLimit_label||"接收限速",
				rxAvg : i18n.perform_term_bandAvgMbps_label||"接收平均带宽",
				rxMax : i18n.perform_term_bandPeakMbps_label||"接收峰值带宽",
				rxBurst : i18n.common_term_gustyMbps_label||"接收突发大小",
				arpCfg : i18n.vpc_term_ARPsuppressionKbps_label||"ARP报文抑制",
				ipCfg: i18n.vpc_term_IPsuppressionKbps_label||"IP报文抑制",
				dhcpCfg: i18n.vpc_term_DHCPisolation_label||"DHCP隔离",
				macCfg: i18n.common_term_IPbondMAC_label||"IP绑定MAC"
			}
			
			$scope.form = {
				zone : [],
				az : [],
				vpc : [],
				type : [],
				vlan : [],
				ipAlloc : [
					{id: "1", name: i18n.common_term_innerDHCP_label||"内部DHCP", checked: true},
					{id: "3", name: i18n.vpc_term_staticInjection_label||"静态注入"}
				],
				txPri : [
					{id: "7", name: i18n.common_term_low_label||"低", checked: true},
					{id: "4", name: i18n.common_term_middling_label||"中"},
					{id: "2", name: i18n.common_term_high_label||"高"}
				],
				txCfg : [
					{id: "false", name: i18n.common_term_notLimit_value||"不限速", checked: true},
					{id: "true", name: i18n.common_term_speedLimit_label||"限速"}
				],
				rxCfg : [
					{id: "false", name: i18n.common_term_notLimit_value||"不限速", checked: true},
					{id: "true", name: i18n.common_term_speedLimit_label||"限速"}
				],
				arpCfg : [
					{id: "false", name: i18n.common_term_notBate_value||"不抑制", checked: true},
					{id: "true", name: i18n.common_term_suppression_label||"抑制"}
				],
				ipCfg : [
					{id: "false", name: i18n.common_term_notBate_value||"不抑制", checked: true},
					{id: "true", name: i18n.common_term_suppression_label||"抑制"}
				],
				dhcpCfg : [
					{id: "false", name: i18n.common_term_notIsolation_value||"不隔离", checked: true},
					{id: "true", name: i18n.common_term_isolation_value||"隔离"}
				],
				macCfg : [
					{id: "false", name: i18n.common_term_noBond_value||"不绑定"},
					{id: "true", name: i18n.vpc_term_bond_label||"绑定", checked: true}
				],
				subnetCheck : function(ip, mask, gate){
					if ((ip & mask) != (ip & 0xFFFFFFFF)){
						return i18n.common_term_formatSubnetIP_valid||"子网IP地址不合法";
					}
					return true;
				},
				gateCheck : function(ip, mask, gate){
					if ((ip & mask) != (gate & mask)){
						return i18n.vpc_term_gatewayNotInSubnet_valid||"网关地址不在子网内";
					}
					
					if (ip == gate){
						return i18n.vpc_term_gatewayError_valid||"网关不合法";
					}
					
					if ((gate & (~mask)) == (~mask)){
						return i18n.vpc_term_gatewayError_valid||"网关不合法";
					}
					
					var sub = ip;
					if ((gate >= sub+2) && (gate <= sub+4)){
						return (i18n.resource_term_conflictWithReservedIP_valid||"与预留IP地址冲突")
							+"("+fmLib.ip2string(sub+2)+"-"+fmLib.ip2string(sub+4)+")";
					}
					return true;
				},
				subCheck : function(gate, mask, beg, end){
					var sub = gate;
					
					if (beg){
						if ((beg & mask) != (gate & mask)){
							return i18n.resource_term_outSubnet_valid||"不在子网范围内";
						}
						
						if (beg == gate){
							return i18n.common_term_formatIP_valid||"IP地址不合法";
						}
						
						if ((beg & (~mask)) == (~mask)){
							return i18n.common_term_formatIP_valid||"IP地址不合法";
						}
					}
						
					if (end){
						if ((end & mask) != (gate & mask)){
							return i18n.resource_term_outSubnet_valid||"不在子网范围内";
						}
						
						if (end < beg){
							return i18n.common_term_endGreaterEqualStartIP_valid||"结束IP地址必须大于等于开始IP地址。";
						}
						
						if (end == gate){
							return i18n.common_term_formatIP_valid||"IP地址不合法";
						}
						
						if ((end & (~mask)) == (~mask)){
							return i18n.common_term_formatIP_valid||"IP地址不合法";
						}
					}
					
					function inRange(b1, e1, b2, e2){
						if (b2){
							if (e2){
								return !((e1 < b2) || (b1 > e2));
							}else{
								return (b2 <= e1) && (b2 >= b1);
							}
						}else{
							if (e2){
								return (e2 <= e1) && (e2 >= b1);
							}
						}
						return false;
					}
					
					if (inRange(sub+2, sub+4, beg, end)){
						return (i18n.resource_term_conflictWithReservedIP_valid||"与预留IP地址冲突")
							+"("+fmLib.ip2string(sub+2)+"-"+fmLib.ip2string(sub+4)+")";
					}
					
					for (var i in $scope.para.ipRange){
						var e = $scope.para.ipRange[i];
						var b = fmLib.string2ip(e.startIP),e=fmLib.string2ip(e.endIP);
						if ((b == beg) && (e == end)){
							continue;
						}
						if (inRange(b, e, beg, end)){
							return (i18n.resource_term_conflictWithCurrentIPsegment_valid||"与已有IP地址段冲突")
							+"("+fmLib.ip2string(b)+"-"+fmLib.ip2string(e)+")";
						}
					}
					
					return true;
				}
			}
			
			$scope.vlanTable = {
				"columns": [
					{"sTitle": "ID", "mData": "id", "sWidth": "80px", "bSortable": false},
					{"sTitle": i18n.common_term_name_label||"名称", "mData": "name", "sWidth": "120px", "bSortable": false},
					{"sTitle": i18n.common_term_initiative_label||"起始", "mData": "start", "sWidth": "80px", "bSortable": false},
					{"sTitle": i18n.common_term_termination_label||"终止", "mData": "end", "sWidth": "80px", "bSortable": false}
				],
				"data": [],
				row : function(row, index){
					setTimeout(function(){
						$scope.para.vlanPool = row;
						$scope.para.vlan = row.start;
						$scope.$digest();
					}, 0);
				}
			}
			
			$scope.netTable = {
				"columns": [
					{"sTitle": "ID", "mData": "id", "sWidth": "80px", "bSortable": false},
					{"sTitle": i18n.common_term_name_label||"名称", "mData": "name", "sWidth": "120px", "bSortable": false},
					{"sTitle": i18n.common_term_Subnet_label||"子网", "mData": "subNet", "sWidth": "180px", "bSortable": false},
					{"sTitle": "VLAN", "mData": "vlan", "sWidth": "80px", "bSortable": false}
				],
				"data": [],
				row : function(row, index){
					if (row && row.vlans){
						var i = 0, arr = [];
						for (i = 0; i < row.vlans.length; i++){
							var e = row.vlans[i];
							arr.push({id: e})
						}
						if (i > 0){
							arr[0].checked = true;
						}
						$scope.form.vlan = arr;
						setTimeout(function(){
							$scope.para.net = row;
							$scope.$digest();
						}, 0);
					}
				}
			}
			
			$scope.para = {
				name : "",
				zone : "",
				zoneName : "",
				az : "", 
				azName : "",
				vpc : "",
				vpcName : "",
				type : "",
				typeName : "",
				net : [],
				vlanN : "",
				vlanR : "",
				vlanPool : [],
				ipAlloc : "",
				ipAllocName : "",
				ip : "",
				mask : "255.255.255.0",
				ipRange : [{}],
				gateway : "",
				txCfg : "",
				txCfgName : "",
				txAvg : "",
				txMax : "",
				txBurst : "",
				txPri : "",
				txPriName : "",
				rxCfg : "",
				rxCfgName : "",
				rxAvg : "",
				rxMax : "",
				rxBurst : "",
				arpCfg : "",
				arpCfgName : "",
				arpMax : "",
				ipCfg : "",
				ipCfgName : "",
				ipMax : "",
				dhcpCfg : "",
				dhcpCfgName : "",
				macCfg : "",
				macCfgName : ""
			};

			if ($scope.state.vpc){
				// Modify fill para
				ajax.net.queryNet(0, 100, {vpc:$scope.state.vpc, id:$scope.state.id}, function(data){
					if (data){
						var e = data;
						var para = $scope.para;
						para.id = e.networkID;
						para.name = e.name;
						para.vpc = e.vpcId;
						para.shareVpc = e.shareVpc;
						para.vpcName = e.vpcName;
						para.desp = e.description;
						para.vlan = e.vlan;
						
						para.vlanN = e.vlan;
						
						var typeName = {1:(i18n.vpc_term_directConnectNet_label||"直连网络"),
							2:(i18n.vpc_term_innerNet_label||"内部网络"),
							3:(i18n.vpc_term_routerNet_label||"路由网络")};
						para.typeName = typeName[e.networkType]
							|| (e.directNetwork ? (para.type = "direct", e.networkType=1,typeName[1])
								: (e.routed ? (para.type = "router", e.networkType=3, typeName[3])
									: (para.type = "inner", e.networkType=2, typeName[2])));
						
						$scope.show.router = e.routed 
							|| (e.directNetwork ? false : (e.ipv4Subnet?true:false));
						$scope.show.ext = false;

						if ($scope.show.router){
							var ipCfg = e.ipv4Subnet;
							if (ipCfg){
								if (!e.routed){
									$scope.form.ipAlloc = [
										{id: "1", name: i18n.common_term_innerDHCP_label||"内部DHCP", checked: 1==ipCfg.ipAllocatePolicy},
										{id: "3", name: i18n.vpc_term_staticInjection_label||"静态注入",checked: 3==ipCfg.ipAllocatePolicy},
										{id: "2", name: i18n.common_term_manual_label||"手动",checked: 2==ipCfg.ipAllocatePolicy}
									];
								}
								
								$scope.show.ext = (2 != ipCfg.ipAllocatePolicy);
								para.ipAlloc = "" + ipCfg.ipAllocatePolicy;
								para.ip = ipCfg.subnetAddr;
								para.mask = ipCfg.subnetPrefix;
								para.gateway = ipCfg.gateway;
								para.ipRange = [];
								for (var ip in ipCfg.availableIPRanges){
									para.ipRange.push(ipCfg.availableIPRanges[ip]);
								}
								
								$scope.show.disable = (ipCfg.usedAddrNum || (2==e.networkType)) ? true : false;
							
								var dhcpCfg = ipCfg.dhcpOption;
								if (dhcpCfg){
									para.domain = dhcpCfg.domainName;
									para.dns1 = dhcpCfg.primaryDNS;
									para.dns2 = dhcpCfg.secondaryDNS;
									para.wins1 = dhcpCfg.primaryWINS;
									para.wins2 = dhcpCfg.secondaryWINS;
								}
							}
						}

						if ($scope.show.router || ("inner" == para.type)){
							var Qos = e.portSetting;
							if (Qos){
								para.txCfg = ""+Qos.outTrafficShapingPolicyFlag;
								var tx = Qos.outTrafficShapingPolicy;
								if (tx){
									para.txAvg = tx.averageBandwidth;
									para.txMax = tx.peakBandwidth;
									para.txBurst = tx.burstSize;
									para.txPri = ""+tx.priority;
								}
								para.rxCfg = ""+Qos.inTrafficShapingPolicyFlag;
								var rx = Qos.inTrafficShapingPolicy;
								if (rx){
									para.rxAvg = rx.averageBandwidth;
									para.rxMax = rx.peakBandwidth;
									para.rxBurst = rx.burstSize;
								}
								para.arpCfg = Qos.arpPacketSuppression ? 'true' : 'false';
								para.arpMax = Qos.arpPacketSuppression;
								para.ipCfg = Qos.ipPacketSuppression ? 'true' : 'false';
								para.ipMax = Qos.ipPacketSuppression;
								para.dhcpCfg = ""+Qos.dhcpIsolationFlag;
								para.macCfg = ""+Qos.ipMacBindFlag;
							}
						}
					}
					
					$scope.$digest();
				});
			}
			
			$scope.event = {
				zoneChange : function(id, name){
					if ((null == id) || ("" == id)){
						$scope.form.az = [];
						return;
					}
					ajax.net.getAZ(id, function(data){
						$scope.form.az = ajax.net.data2az(data);
						$scope.$digest();
					});
				},
				azChange : function(id, name){
					if ((null == id) || ("" == id)){
						$scope.form.vpc = [];
						return;
					}
					ajax.net.getVPC(id, function(data){
						$scope.form.vpc = ajax.net.data2vpc(data);
						$scope.$digest();
					});
				},
				vpcChange : function(id, name){
					$scope.show.router = false;
					$scope.show.ext = false;
					if ((null == id) || ("" == id)){
						return;
					}
					var arr = [
						{id: "direct", name: i18n.vpc_term_directConnectNet_label||"直连网络", checked: true}
					];
					
					var para = {
						vpc: id
					};
					ajax.net.getExtNet(para, function(data){
						var extNet = ajax.net.data2extNet(data);
						$scope.netTable.data = extNet;
						$scope.$digest();
					});

					ajax.net.getRouter(id, function(data){
						var router = ajax.net.data2router(data);
						if (router[id]){
							arr.push({id: "router", name: i18n.vpc_term_routerNet_label||"路由网络"})
						}
						$scope.form.type = arr;
						$scope.$digest();
					},function(){
						$scope.form.type = arr;
					});
				},
				typeChange : function(id, name){
					if ((null == id) || ("" == id)){
						return;
					}
					if ("direct" == id)
					{
						$scope.show.router = false;
						var para = {
							vpc: $scope.para.vpc
						};
						
						ajax.net.getExtNet(para, function(data){
							var extNet = ajax.net.data2extNet(data);
							$scope.netTable.data = extNet;
							$scope.$digest();
						});
					}
					else if ("router" == id)
					{
						$scope.show.router = true;
						var para = {								
							vpc : $scope.para.vpc,
							az : $scope.para.az
						}
						ajax.net.getVLAN(para, function(data){
							var vlan = ajax.net.data2vlan(data);
							$scope.vlanTable.data = vlan;
							$scope.$digest();
						});
					}
				},
				ipAllocChange : function(id, name){
					$scope.show.ext = ('2' != id);
					setTimeout(function(){$scope.$digest();}, 1);
				},
				txCfg : function(id, name){
					$scope.show.txCfg = ('true' == id);
					$scope.$digest();
				},
				rxCfg : function(id, name){
					$scope.show.rxCfg = ('true' == id);
					$scope.$digest();
				},
				arpCfg : function(id, name){
					$scope.show.arpCfg = ('true' == id);
					$scope.$digest();
				},
				ipCfg : function(id, name){
					$scope.show.ipCfg = ('true' == id);
					$scope.$digest();
				}
			}
			
			function fillPara() {			
				var p = $scope.para;
				
				var para = {
					id : p.id,
					vpc : p.vpc,
					az : p.az,
					name : p.name,
					desp : p.desp,
					router: "router" == p.type,
					dirctNetwork: "direct" == p.type,
					ipType: p.ipAlloc,
					subnet: p.ip,
					mask: p.mask,
					gateway: p.gateway
				}

				if ("direct" == p.type){
					para.netID = p.net.id
					para.vlan = p.vlanN;
					return para;
				}
				
				para.ipRange = [];
				for (var i in p.ipRange){
					var e = p.ipRange[i];
					if (e.startIP && e.endIP){
						para.ipRange.push({startIP:e.startIP, endIP:e.endIP});
					}
				}
				
				if (!$scope.state.vpc){
					para.vlan = p.vlanR;
				}
				
				para.portSetting = {
					inTrafficShapingPolicyFlag : 'true'==p.rxCfg,
					outTrafficShapingPolicyFlag : 'true'==p.txCfg,
					arpPacketSuppression : 'true'==p.arpCfg ? p.arpMax : 0,
					ipPacketSuppression : 'true'==p.ipCfg ? p.ipMax : 0,
					dhcpIsolationFlag : 'true'==p.dhcpCfg,
					ipMacBindFlag : 'true'==p.macCfg
				};
				
				if ('true'==p.rxCfg){
					para.portSetting.inTrafficShapingPolicy = {
						averageBandwidth : p.rxAvg,
						peakBandwidth : p.rxMax,
						burstSize : p.rxBurst
					}
				}
				if ('true'==p.txCfg){
					para.portSetting.outTrafficShapingPolicy = {
						averageBandwidth : p.txAvg,
						peakBandwidth : p.txMax,
						burstSize : p.txBurst,
						priority : p.txPri
					}
				}
					
				para.dhcpOption = {
					domainName : p.domain,
					primaryDNS : p.dns1,
					secondaryDNS : p.dns2,
					primaryWINS : p.wins1,
					secondaryWINS : p.wins2
				}
							
				return para;
			}		

			ajax.net.getZone(function(data){
				$scope.form.zone = ajax.net.data2zone(data);
				$scope.$digest();
			});
		}];
		
		return ctrl;
	});