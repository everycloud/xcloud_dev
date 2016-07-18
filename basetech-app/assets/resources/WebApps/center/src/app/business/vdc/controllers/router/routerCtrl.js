
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxVPC"], 
function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", function ($scope) {
		
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			ict : ajax.ict(),
			router : false,
			use : false,
			check : false
		}
		
		$scope.form = {
			zone:[],
			az:[],
			vpc:[]
		}
		
		$scope.para = {
			zone: "",
			az: "",
			vpc: "",
			rx: 50,
			tx: 50
		}

        $scope.create = function () {
			ajax.net.getZone(function(data){
				$scope.form.zone = ajax.net.data2zone(data);
				$scope.$digest();
			});

			$scope.para.rx = 50;
			$scope.para.tx = 50;

			$scope.show.router = true;
			$scope.$digest();
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
				$scope.show.use = true;
				if ((null == id) || ("" == id)){
					return;
				}
				ajax.net.getRouter(id, function(data){
					var router = ajax.net.data2router(data);
					if (router[id]){
						$scope.show.use = false;
					}
					$scope.$digest();
				});
			}
		}

		$scope.save = function(){
			if (!$scope.show.check){
				return;
			}

			ajax.net.createRouter({
					vpc : $scope.para.vpc,
					az : $scope.para.az,
					rx : $scope.para.rx,
					tx : $scope.para.tx,
					routerType : 1,
					enableSnat : false,
					supportVxlanFlag : false
				},
				$scope.update,
				$scope.update);
			$scope.show.router = false;
			$scope.$digest();
        };

		$scope.cancel = function(){
			$scope.show.router = false;
			$scope.$digest();
        };

		function data2table(data)
		{
			if (data && data.routers)
			{
				var key = {'READY':i18n.common_term_ready_value||"就绪",
					'PENDING':i18n.common_term_creating_value||"创建中",
					'DELETING':i18n.common_term_deleting_value||"删除中",
					'FAIL':i18n.common_term_fail_label||"失败"};
				var i = 0;
				var arr = [];
				for (i = 0; i < data.routers.length; i++)
				{
					var e = data.routers[i];
					e.id = e.routerID;
					e.vpc = e.vpcName;
					e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
					e.state = key[e.status] ? key[e.status] : i18n.common_term_unknown_value||"未知";
					arr.push(e);
				}
				
				$scope.table.data = arr;
			}
			else
			{
				$scope.table.data = [];
			}
			
			$scope.$apply();
		}
		
		function fillList(scope, para)
		{
			scope.table = scope.table || {
				order : [[1,'asc']],
				columns : [
					{sTitle:i18n.common_term_name_label||"名称", mData:"name", "sWidth": "300px", bSortable:false}, 
					{sTitle:"ID", mData:"id", "sWidth": "200px", bSortable:false}, 
					{sTitle:i18n.common_term_status_label||"状态", mData:"state", "sWidth": "80px", bSortable:false},				
					{sTitle:i18n.vpc_term_attachVPC_label||"归属VPC", mData:"vpcName", "sWidth": "150px", bSortable:false},
					{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
					{sTitle:"VPC ID", mData:"vpcID", "sWidth": "180px", bSortable:false}
				],
				dataLen : 10,
				total : 0,
				data : [],
				operate : [
					{name: '{{row.shareVpc?(i18n.common_term_delete_button||"删除"):""}}', func: "table.remove"}
				],
				remove : function(arr, idx){
					ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.router_router_del_info_confirm_msg||"确定要删除此路由器？",
						function(){
							ajax.net.removeRouter(arr.id, arr.vpcID, $scope.update, $scope.update);
						});
				}
			}
		}

		$scope.change = function(e){
		}

		fillList($scope);
		
		$scope.update = function()
		{
			ajax.net.getRouter(-1, data2table);
		}
		
		$scope.update();
    }];
	
    return ctrl;
});