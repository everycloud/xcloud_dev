
define(['tiny-lib/angular',
	"app/services/tipMessageService",
	"app/business/vdc/services/ajaxNet"],

	function (angular, tipSrv, ajax) {
		"use strict";
		
		var ctrl = ["$scope", "$state", "fmLib", "$stateParams", function ($scope, $state, fmLib, $stateParams) {
			
			var i18n = $scope.i18n || {};

			$scope.step_status = 0;
			$scope.state = $stateParams;

			$scope.show = {}
			$scope.show.next = true;
			
			var tip = new tipSrv();

			$scope.cancel = function () {
				$state.go("vdcMgr.vpn.link");
			};
			
			$scope.create = function () {
				var para = fillPara();
				if ($stateParams.modify){
					ajax.vpn.modifyVPN(para, 
						$scope.cancel, $scope.cancel);
				}else{
					ajax.vpn.createVPN(para, 
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
				
				if (2 == $scope.step_status){
					syncTable();
					if (!$scope.show.next){
						tip.alert("error", i18n.vpc_term_chooseNet_label || "请选择待关联的网络");
						return;
					}
				}
				
				$scope.step_status++;
				$scope.$digest();
			};
			
			$scope.ipSave = function(){
				if (!$scope.show.ipCheck){
					return;
				}
				
				var arr = $scope.netTable.data;
				$scope.netTable.data = [];
				$scope.$digest();
				
				var e = arr[$scope.para.index];
				e.subNetIP = $scope.para.ip;
				e.subNetMask = $scope.para.mask;
				
				$scope.netTable.data = arr;
				
				$scope.ipCancel();
			}
			
			$scope.ipCancel = function(){
				if (!$scope.show.ipCheck){
					var box = $scope.netTable.data[$scope.para.index].box;
					$scope.netTable.data[$scope.para.index].box = [];
					$scope.$digest();
					box[0].checked = false;
					$scope.netTable.data[$scope.para.index].box = box;
				}
				
				$scope.show.ipCfg = false;
				$scope.$digest();
			}
			
			$scope.label = {
				name : i18n.common_term_name_label||"名称",
				zone : i18n.resource_term_zone_label||"资源分区",
				az : i18n.resource_term_AZ_label||"可用分区",
				vpc : i18n.common_term_shareVPC_label||"共享VPC",
				desp : i18n.common_term_desc_label||"描述",
				type : i18n.vpn_term_vpnType_label||"VPN类型",
				ikeModify : (i18n.vpn_term_modifyIKEsharePsw_button||"修改IKE预共享密码"),
				ikeOldPass : (i18n.vpn_term_IKEshareInitialPsw_label||"IKE预共享原密码"),
				ikePass : (i18n.vpn_term_IKEsharePsw_label||"IKE预共享密码"),
				confirmIkePass : (i18n.vpn_term_IKEsharePswConfirm_label||"确认IKE预共享密码"),
				tunnelModify : (i18n.vpn_term_modifyTunnlePsw_button||"修改隧道加密密码"),
				tunnelOldPass : (i18n.vpn_term_tunnelEncryptInitialPsw_label||"隧道加密原密码"),
				tunnelPass : (i18n.vpn_term_tunnelEncryptPsw_label||"隧道加密密码"),
				confirmTunnelPass : (i18n.vpn_term_tunnelEncryptPswConfirm_label||"确认隧道加密密码")
			}
			
			$scope.form = {
				zone : [],
				az : [],
				vpc : [],
				ikeModify : [
					{id: "true", name: i18n.common_term_yes_button||"是", checked: false},
					{id: "false", name: i18n.common_term_no_label||"否", checked: true},
				],
				tunnelModify : [
					{id: "true", name: i18n.common_term_yes_button||"是", checked: false},
					{id: "false", name: i18n.common_term_no_label||"否", checked: true},
				],
				subnetCheck : function(ip, mask){
					if ((ip & mask) != (ip & 0xFFFFFFFF)){
						return i18n.common_term_formatSubnetIP_valid||"子网IP地址不合法";
					}
					return true;
				},
                maskCheck : function(mask){
                    var exp = /^255\.255\.254\.0|255\.255\.255\.(240|224|192|128|0)$/;
                    var reg = mask.match(exp);
                    return reg ? true : i18n.common_term_formatSubnetMask_valid||"掩码格式不正确";
                },
				ikePass : function(pass){
					if (typeof pass != 'string'){
						return i18n.common_term_compositionSpecial3_valid||"";
					}
					
					if ((pass.length < 8) || (pass.length > 127)){
						return i18n.common_term_length_valid ? i18n.sprintf(i18n.common_term_length_valid,{1:8,2:127}):"";
					}
					
					if (pass.match(/[\\\'\"\?]+/g)){
						return i18n.common_term_compositionSpecial3_valid||"";
					}
					
					var ans = pass.match(/[\ \`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\|\[\{\}\]\;\:\,\<\.\>\/\w]+/g);
                    var cnt=0;
                    pass.match(/[A-Z]/g) ? cnt++ : 0;
                    pass.match(/[a-z]/g) ? cnt++ : 0;
                    pass.match(/[0-9]/g) ? cnt++ : 0;
					return (ans && (cnt >= 2)) ? true :
						i18n.common_term_compositionSpecial3_valid||"";
				},
				tunnelPass : function(pass){
					if (typeof pass != 'string'){
						return i18n.common_term_compositionInclude1_valid||"";
					}
					
					if ((pass.length < 8) || (pass.length >= 16)){
						return i18n.common_term_length_valid ? i18n.sprintf(i18n.common_term_length_valid,{1:8,2:16}):"";
					}
					
					if (pass.match(/[\?]+/g)){
						return i18n.common_term_compositionInclude1_valid||"";
					}
					
					var ans = pass.match(/[\ \`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\}\]\;\:\'\"\,\<\.\>\/\w]+/g);
					var cnt = 0;
					pass.match(/[A-Za-z]/g) ? cnt++ : 0;
					pass.match(/[0-9]/g) ? cnt++ : 0;
					return (ans && (cnt >= 2)) ? true : 
						i18n.common_term_compositionInclude1_valid||"";
				},
				ikePassTip : (i18n.common_term_compositionSpecial3_valid||"")
					+ (i18n.common_term_length_valid ? i18n.sprintf(i18n.common_term_length_valid,{1:8,2:127}):""),
				tunnelPassTip : (i18n.common_term_compositionInclude1_valid||"")
					+ (i18n.common_term_length_valid ? i18n.sprintf(i18n.common_term_length_valid,{1:8,2:16}):"")
			}
			
			$scope.netTable = {
				"columns": [
					{"sTitle": "", "mData": "id", "sWidth": "26px", "bSortable": false},
					{"sTitle": i18n.common_term_name_label||"名称", "mData": "name", "sWidth": "120px", "bSortable": false},
					{"sTitle": i18n.common_term_SubnetAndMask_label||"子网/掩码", "mData": "subNet", "sWidth": "240px", "bSortable": false},
					{"sTitle": "VLAN", "mData": "vlan", "sWidth": "80px", "bSortable": false},
					{"sTitle": i18n.common_term_SubnetIP_label||"子网IP地址", "mData": "subNetIP", "sWidth": "150px", "bSortable": false},
					{"sTitle": i18n.common_term_SubnetMask_label||"子网掩码", "mData": "subNetMask", "sWidth": "150px", "bSortable": false},
				],
				"data": []
			}
			
			function data2table(data){
				if (data && data.networks){
					var i = 0;
					var arr = [];
					var map = $scope.para.netIDMap || {};
					
					for (i = 0; i < data.networks.length; i++)
					{
						var e = data.networks[i];
						e.netID = e.networkID;
						e.name = e.name;
						e.vpc = e.vpcId;
						e.vlan = e.vlan;
						e.subNet = [
							e.ipv4Subnet?e.ipv4Subnet.subnetAddr+"/"+e.ipv4Subnet.subnetPrefix:"",
							e.ipv6Subnet?e.ipv6Subnet.subnetAddr+"/"+e.ipv6Subnet.subnetPrefix:"",
						].join(";");
						
						var o = map[e.networkID];
						if (o){
							e.subNetIP = o.subnetAddr;
							e.subNetMask = o.subnetMask;
							e.box = [{id:i, name:'', checked: true}];
						}else{
							e.subNetIP = "";
							e.subNetMask = "";
							e.box = [{id:i, name:'', checked: false}];
						}
						
						if ($scope.para.info){
							
						}
						
						arr.push(e);
					}
					
					$scope.netTable.data = arr;
				}
				else{
					$scope.netTable.data = [];
				}
				
				$scope.$digest();
			}

			$scope.netTableShow = {
				columns : $scope.netTable.columns.slice(1),
				data : $scope.netTable.data
			}
			
			function syncTable(){
				var i = 0, arr = [];
				for (; i < $scope.netTable.data.length; i++){
					var e = $scope.netTable.data[i];
					if ($scope.para.map[i]){
						arr.push(e);
					}
				}
				$scope.netTableShow.data = arr;
				$scope.show.next = (arr.length > 0);
			}
			
			$scope.para = {
				map : {},
				name : "",
				zone : "",
				zoneName : "",
				az : "", 
				azName : "",
				vpc : "",
				vpcName : ""
			};
			
			if ($stateParams.modify){
				$scope.para.netIDMap = {};
				ajax.vpn.getLink($stateParams.id, $stateParams.vpc, function(data){
					if (data){
						var e = data;
						var para = $scope.para;
						para.id = $stateParams.id;
						para.vpc = $stateParams.vpc;
						para.vpcName = $stateParams.vpcName;
						para.name = e.name;
						para.desp = e.description;
						para.info = e;
						$scope.$digest();
						
						if (e.l2tpInfo && e.l2tpInfo.subnetPolicys){
							var map = {};
							for (var k in e.l2tpInfo.subnetPolicys){
								var o = e.l2tpInfo.subnetPolicys[k];
								map[o.networkIDs.join()] = o;
							}
							para.netIDMap = map;
						}
						
						ajax.vpn.queryNet($stateParams.vpc, data2table);
					}
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
					if ((null == id) || ("" == id)){
						return;
					}
					ajax.vpn.queryNet(id, data2table);
				},
				ikeModify : function(id, name){
					$scope.show.ike = "true"==id;
					$scope.$digest();
				},
				tunnelModify : function(id, name){
					$scope.show.tunnel = "true"==id;
					$scope.$digest();
				},
				click : function(index){
					$scope.show.ipCheck = false;
					
					var e = $scope.netTable.data[index];
					$scope.para.ip = e.subNetIP||" ";
					$scope.para.mask = e.subNetMask||"255.255.255.0";
					
					var box = e.box;
					box[0].checked = !box[0].checked;
					$scope.para.index = index;
					$scope.show.ipCfg = box[0].checked;
				}
			}
			
			function fillPara() {
				var p = $scope.para;
				
				var para = {
					id : p.id,
					vpcID : p.vpc,
					vpnType : 1,
					name : p.name,
					description: p.desp,
					l2tpInfo : {
						l2tpType : 1,
						tunnelKey : p.tunnelPass,
						subnetPolicys : []
					},
					ikeSharedKey : p.ikePass
				}
				
				var i = 0;
				var arr = para.l2tpInfo.subnetPolicys;
				for (; i < $scope.netTableShow.data.length; i++){
					var e = $scope.netTableShow.data[i];
					arr.push({
						subnetAddr : e.subNetIP,
						subnetMask : e.subNetMask,
						networkIDs : [e.netID]
					});
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