
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxNet",
	"app/services/timeService"], 
	function (angular, ajax, timeService) {
	"use strict";
	
	var date = new timeService();

	var ctrl = ["$scope", "$state", function ($scope,$state) {
		var demo = false;
		
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			detail : false
		}
		
		$scope.create = function () {
			$state.go("vdcMgr_vpn_newLink");
        };
		
		$scope.table = {
			columns : [
				{sTitle: i18n.common_term_name_label||"名称", mData: "name", sWidth: "120px", bSortable: false},
                {sTitle:"ID", mData:"id", "sWidth": "80px", bSortable:false},
                {sTitle: i18n.common_term_status_label||"状态", mData: "status", sWidth: "60px", bSortable: false},
				{sTitle: i18n.vpn_term_vpnType_label||"VPN类型", mData: "type", sWidth: "90px", bSortable: false},
				{sTitle: i18n.common_term_createAt_label||"创建时间", mData: "create", sWidth: "120px", bSortable: false},
				{sTitle: i18n.common_term_modifyTime_label||"修改时间", mData: "modify", sWidth: "120px", bSortable: false},
				{sTitle: i18n.vpc_term_attachVPC_label||"归属VPC", mData: "vpc", sWidth: "120px", bSortable: false},
				{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
				{sTitle: "VPC ID", mData: "vpcID", sWidth: "180px", bSortable: false}
			],
			operate : [
				{name: '{{row.shareVpc&&(i18n.common_term_ready_value == row.status||i18n.common_term_fail_label == row.status)?(i18n.common_term_delete_button||"删除"):""}}', func: "table.remove"},
				{name: '{{row.shareVpc&&(1==row.vpnType)&&(i18n.common_term_ready_value== row.status)?(i18n.common_term_modify_button||"修改"):""}}', func: "table.modify"}
			],
			remove : function(arr, idx){
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.vpn_connect_del_info_confirm_msg||"确定要删除VPN链接?", 
					function(){
						ajax.vpn.delLink(arr.id, arr.vpcID,
							$scope.table.update);
					});
			},
			modify : function(arr, idx){
				$state.go("vdcMgr_vpn_newLink", {modify:true, vpc: arr.vpcID, vpcName: arr.vpcName, id: arr.id});
			},
			data: [],
			update : function (){
				$scope.table.data = [];
				
				function data2table(data){
					if (data && data.vpnConnections){
						var arr = [];
						for (var i in data.vpnConnections){
							var e = data.vpnConnections[i];
							var o = e;
							o.id = e.vpnConnectionID;
							o.name = e.name;
							o.status = {'READY':i18n.common_term_ready_value||"就绪",
								'PENDING':i18n.common_term_creating_value||"创建中",
								'DELETING':i18n.common_term_deleting_value||"删除中",
								'FAIL':i18n.common_term_fail_label||"失败",
								'UPDATING':i18n.common_term_updating_value||"更新中"}[e.status] || e.status;
							o.type = {0:"IPSec",1:"L2TP"}[e.vpnType] || e.vpnType;
							try{
							o.create = new Date(e.createTime).format('yyyy-MM-dd hh:mm:ss');
							o.modify = new Date(e.lastModifiedTime).format('yyyy-MM-dd hh:mm:ss');
							}catch(e){};
							o.vpc = (e.vpcName || "");
							o.vpcID = (e.vpcId || "");
							e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
							arr.push(o);
						}
						
						$scope.table.data = arr;
					}
					$scope.$digest();
				}
				ajax.vpn.getLink(null, null, data2table, function(){$scope.$digest();});
			}
		}
		
		$scope.table.update();
	}];
	
	return ctrl;
});