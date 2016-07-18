
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxNet"], 
	function (angular, ajax) {
	"use strict";

	var ctrl = ["$scope", function ($scope) {
		
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			create : false
		}
		
		$scope.cancel = function () {
			$scope.show.create = false;
			$scope.$digest();
			$scope.table.update();
		};
		
		$scope.create = function () {
            $scope.para = {};
            $scope.para.name ="";
            $scope.para.desp="";
			ajax.net.getZone(function(data){
				$scope.form.zone = ajax.net.data2zone(data);
				$scope.$digest();
			});
            $scope.show.create = true;
            $scope.$digest();
		};
		
		$scope.add = function () {
			if (!$scope.show.check){
				return;
			}
			
			var p = $scope.para;
			var para = {
				vpcId : p.vpc,
				name : p.name,
				ipAddr : p.eip,
				sharedVpc : true,
				description : p.desp
			};
			ajax.vpn.createGate(para, 
				$scope.cancel, $scope.cancel);
		};
		
		$scope.table = {
			columns : [
				{sTitle: i18n.common_term_name_label||"名称", mData: "name", sWidth: "180px", bSortable: false},
                {sTitle:"ID", mData:"id", "sWidth": "120px", bSortable:false},
                {sTitle: i18n.eip_term_eip_label||"弹性IP地址", mData: "ip", sWidth: "180px", bSortable: false},
				{sTitle: i18n.vpc_term_attachVPC_label||"归属VPC", mData: "vpc", sWidth: "120px", bSortable: false},
				{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
				{sTitle: "VPC ID", mData: "vpcID", sWidth: "180px", bSortable: false},
				{sTitle: i18n.common_term_desc_label||"描述", mData: "info", sWidth: "180px", bSortable: false},
			],
			operate : [
				{name: '{{row.shareVpc?(i18n.common_term_delete_button||"删除"):""}}', func: "table.remove"}
			],
			remove : function(arr, idx){
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.vpn_gateway_del_info_confirm_msg||"确定要删除VPN网关?", 
					function(){
						ajax.vpn.delGateway(arr.id, arr.vpcID, arr.shareVpc,
							$scope.table.update);
					});
			},
			data: [],
			update : function (){
				$scope.table.data = [];
				
				function data2table(data){
					if (data && data.vpngws){
						var arr = [];
						for (var i in data.vpngws){
							var e = data.vpngws[i];
							var o = e;
							var b = e.basicInfo;
							o.id = b.vpnGwId;
							o.name = b.name;
							o.ip = b.ipAddr;
							o.vpc = (b.vpcName||"");
							o.vpcID = (b.vpcId||"");
							o.info = (b.description||"");
							o.shareVpc = b.shareVpc;
							e.vpcType = o.shareVpc ? (i18n.common_term_share_label||"共享") : (i18n.common_term_noShare_value||"非共享");
							arr.push(o);
						}
						
						$scope.table.data = arr;
					}
					$scope.$digest();
				}
				ajax.vpn.getGateway(data2table);
			}
		};
				
		$scope.label = {
			name : i18n.common_term_name_label||"名称",
			zone : i18n.resource_term_zone_label||"资源分区",
			az : i18n.resource_term_AZ_label||"可用分区",
			vpc : i18n.common_term_shareVPC_label||"共享VPC",
			eip : i18n.eip_term_eip_label||"弹性IP地址",
			desp : i18n.common_term_desc_label||"描述"
		};
		
		$scope.para = {};
		
		$scope.form = {
			zone : [],
			az : [],
			vpc : [],
			eip : []
		};
		
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
				
				function data2table(data){
					if (data && data.elasticIPs){
						var arr = [];
						for (var i in data.elasticIPs){
							var e = data.elasticIPs[i];
							arr.push({id:e.ip});
						}
						if (arr.length > 0){
							arr[0].checked = true;
						}
						$scope.form.eip = arr;
					}
					$scope.$digest();
				}
			}
		};
		
		$scope.table.update();
	}];
	
	return ctrl;
});