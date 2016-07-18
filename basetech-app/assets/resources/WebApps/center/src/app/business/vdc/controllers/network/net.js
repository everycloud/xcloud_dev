
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxVPC"], 
	function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", "$state",
		function ($scope, $state) {
		
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			ict : ajax.ict()
		}
		
		$scope.form = {
			type : [
				{id: "name", name: i18n.common_term_name_label||"名称", checked: true},
				{id: "vlan", name: "VLAN ID"}
			],
			id : "",
			name : "",
			key : ""
		}
		
		$scope.para = {};
		
		$scope.event = {
			search : function(key){
				var o = {};
				o[$scope.form.id] = key;
				ajax.net.queryNet(0, $scope.table.dataLen, o, data2table);
			},
			showIP : function(row){
				$scope.show.ip = true;
				$scope.autoTable.update(row.id, row.vpc);
				$scope.manTable.update(row.id, row.vpc);
				$scope.para.id = row.id;
				$scope.para.vpc = row.vpc;
				$scope.para.show = row.routed && !row.shareVpc;
			},
			showVM : function(row){
				$scope.show.vm = true;
				$scope.vmTable.update(row.id);
				$scope.para.id = row.id;
			}
		}

        $scope.create = function () {
			$state.go("vdcMgr_newNetwork");
        };

		function data2table(data)
		{
			if (data && data.networks)
			{
				var key = {'READY':i18n.common_term_ready_value||"就绪",
					'DELETING':i18n.common_term_deleting_value||"删除中",
					'PENDING':i18n.common_term_creating_value||"创建中",
					'FAIL':i18n.common_term_fail_label||"失败",
					'UPDATING':i18n.common_term_modifing_value||"修改中",
					'UPDATEFAIL':i18n.common_term_modifyFail_value||"修改失败"};

				var i = 0;
				var arr = [];
				for (i = 0; i < data.networks.length; i++)
				{
					var e = data.networks[i];
					e.id = e.networkID;
					e.name = e.name;
					e.vpc = e.vpcId;
					e.azId = e.azID;
					e.netType = e.directNetwork?(i18n.vpc_term_directConnectNet_label||"直连网络")
							:(e.routed?(i18n.vpc_term_routerNet_label||"路由网络")
								:(i18n.vpc_term_innerNet_label||"内部网络"));
					e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
					e.statusV = key[e.status]||i18n.common_term_unknown_value||"未知";
					if (null != e.snat){
						e.snatV = {'READY':i18n.common_term_ready_value||'就绪',
							'ENABLING':i18n.common_term_turnOning_value||'开启中',
							'DISABLING':i18n.common_term_shuting_value||'关闭中',
							'FAIL':i18n.common_term_fail_label||'失败',
							'FORCED_TO_DISABLING':i18n.common_term_forceShuting_value||'强制关闭中'}
							[e.snat.status]||"";
						e.snatS = (('READY' == e.snat.status) || ('FAIL' == e.snat.status)) ? (e.snatO=false,i18n.vpc_term_shutSNAT_button||"关闭SNAT"):"";
					}else{
						e.snatV = "";
						e.snatS = ('READY' == e.status) ? (e.snatO=true,i18n.common_term_turnOnSNAT_button||"开启SNAT"):"";
					}
					
					e.bModify = ('READY'==e.status)||('FAIL'==e.status)||('UPDATEFAIL'==e.status);
					
					if (true != e.routed){
						e.snatS = "";
					}
					
					arr.push(e);
				}
				
				$scope.table.data = arr;
				$scope.table.total = data.total;
			}
			else
			{
				$scope.table.data = [];
			}
			
			$scope.$digest();
		}
		
		function fillList(scope, para)
		{
			scope.table = scope.table || {
				order : [[1,'asc']],
				columns : [
					{sTitle:i18n.common_term_name_label||"名称", mData:"name", "sWidth": "120px", bSortable:false}, 
					{sTitle:"ID", mData:"id", "sWidth": "120px", bSortable:false},
					{sTitle:(i18n.vpc_term_netType_label||'网络类型'), mData:"netType", "sWidth": "60px", bSortable:false},
					// 20140708 Tiny字符串长度超过16排不了序
					{sTitle:i18n.vpc_term_attachVPC_label||"归属VPC", mData:"vpcName", "sWidth": "180px", bSortable:false},
					{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
					{sTitle:(i18n.resource_term_AZ_label||"可用分区"), mData:"azName", "sWidth": "180px", bSortable:false},
					{sTitle:i18n.common_term_status_label||"状态", mData:"statusV", "sWidth": "60px", bSortable:false},
					{sTitle:"SNAT", mData:"snatV", "sWidth": "60px", bSortable:false}
				],
				dataLen : 10,
				total : 0,
				data : [],
				operate : [
					{name: '{{row.bModify?(i18n.common_term_modify_button||"修改"):""}}', func: "table.modify"},
					{name: '{{row.shareVpc?(i18n.common_term_delete_button||"删除"):""}}', func: "table.remove"},
					{name: "{{row.shareVpc?row.snatS:''}}", func: "table.snat"}
				],
				snat : function(arr, idx){
					if (arr.snatO){
						ajax.confirm(i18n.common_term_confirm_label||"SNAT", i18n.vpc_snat_enableSNAT_info_confirm_msg||"确定要开启SNAT?", 
							function(){
								ajax.net.addSNAT(arr.vpcId, arr.id, $scope.table.update, $scope.table.update);
							});
					}else{
						ajax.confirm(i18n.common_term_confirm_label||"SNAT", i18n.vpc_snat_disableSNAT_info_confirm_msg||"确定要关闭SNAT?", 
							function(){
								ajax.net.rmvSNAT(arr.snat.snatID, arr.vpcId, $scope.table.update, $scope.table.update);
							});
					}
				},
				remove : function(arr, idx){
					ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.vpc_net_del_info_confirm_msg||"确定要删除此网络?", 
						function(){
							ajax.net.removeNet(arr.id, arr.vpcId, $scope.update, $scope.update);
						});
				},
				modify : function(arr, idx){
					$state.go("vdcMgr_newNetwork", {vpc: arr.vpc, id: arr.id});
				}
			}
		}
		
		$scope.autoTable = {
			columns : [
                {sTitle: "ID", mData: "id", sWidth: "80px", bSortable: false},
				{sTitle: "IP", mData: "ip", sWidth: "80px", bSortable: false},
				{sTitle: i18n.vpc_term_bondObj_label||"绑定对象", mData: "obj", sWidth: "80px", bSortable: false},
				{sTitle: i18n.common_term_status_label||"状态", mData: "state", sWidth: "60px", bSortable: false},
				{sTitle: i18n.eip_term_eip_label||"弹性IP地址", mData: "eip", sWidth: "80px", bSortable: false},
				{sTitle: i18n.common_term_assignTime_label||"分配时间", mData: "time", sWidth: "80px", bSortable: false}
			],
			data: [
			],
			update : function(id, vpc){
				$scope.autoTable.data = [];
				ajax.net.getIP(id, vpc, true, function(data){
					if (data && data.privateIPs){
						var arr = [];
						for (var i in data.privateIPs){
							var e = data.privateIPs[i];
							e.obj = e.vmName + ":" + e.nicName;
							e.state = {'PENDING':i18n.common_term_assigning_value||"分配中",
								'READY':i18n.common_term_assignSucceed_value||"分配成功",
								'FAIL':i18n.common_term_assignFail_value||"分配失败",
								'DELETING':i18n.common_term_reclaiming_value||"回收中",
								'RELEASE_FAIL':i18n.common_term_reclaimFail_value||"回收失败",
								'REALLOCATING':i18n.common_term_reassigning_value||"重新分配中"}[e.status]||"";
							e.eip = e.elasticIP||"";
							e.time = e.allocateTime;
							arr.push(e);
						}
						$scope.autoTable.data = arr;
						$scope.$digest();
					}
				});
			}
		};
		
		$scope.manTable = {
			columns : [
                {sTitle: "ID", mData: "id", sWidth: "80px", bSortable: false},
				{sTitle: "IP", mData: "ip", sWidth: "80px", bSortable: false},
				{sTitle: i18n.common_term_desc_label||"描述", mData: "obj", sWidth: "60px", bSortable: false},
				{sTitle: i18n.common_term_assignTime_label||"分配时间", mData: "createTime", sWidth: "80px", bSortable: false},
				{sTitle: i18n.common_term_status_label||"状态", mData: "state", sWidth: "60px", bSortable: false},
				{sTitle: i18n.eip_term_eip_label||"弹性IP地址", mData: "eip", sWidth: "80px", bSortable: false}
			],
			data: [
			],
			update : function(id, vpc){
				$scope.manTable.data = [];
				ajax.net.getIP(id, vpc, false, function(data){
					if (data && data.privateIPs){
						var arr = [];
						for (var i in data.privateIPs){
							var e = data.privateIPs[i];
							e.obj = e.description||"";
							e.state = {'PENDING':i18n.common_term_assigning_value||"分配中",
								'READY':i18n.common_term_assignSucceed_value||"分配成功",
								'FAIL':i18n.common_term_assignFail_value||"分配失败",
								'DELETING':i18n.common_term_reclaiming_value||"回收中",
								'RELEASE_FAIL':i18n.common_term_reclaimFail_value||"回收失败",
								'REALLOCATING':i18n.common_term_reassigning_value||"重新分配中"}[e.status]||"";
							e.eip = e.elasticIP||"";
							e.createTime = e.allocateTime;
							arr.push(e);
						}
						$scope.manTable.data = arr;
						$scope.$digest();
					}
				});
			}
		};
		
		$scope.vmTable = {
			columns : [
				{sTitle: i18n.common_term_name_label||"名称", mData: "name", sWidth: "80px", bSortable: false},
				{sTitle: "ID", mData: "id", sWidth: "120px", bSortable: false}
			],
			data: [
			],
			update : function(id){
				$scope.vmTable.data = [];
				ajax.net.getVM(id, 0, 30, function(data){
					if (data && data.vmInfoList){
						$scope.vmTable.data = data.vmInfoList;
						$scope.$digest();
					}
				});
			}
		};
		
		$scope.change = function(s, l)
		{
			ajax.net.queryNet(s, l, {}, data2table);
		}

		fillList($scope);
		
		$scope.update = function()
		{
			$scope.form.key = "";
			ajax.net.queryNet(0, $scope.table.dataLen, {}, data2table);
		}
		
		$scope.update();
    }];
    return ctrl;
});