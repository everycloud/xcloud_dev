define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxIPBW"
], function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", function ($scope) {
	
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			win : false,
			title : "",
			create : true,
			check : false
		}
		
		$scope.para = {
			id : null,
			name : "IP_BW_" + (new Date()).getTime(),
			rx : 50,
			tx : 50
		}

		$scope.create = function (){
			$scope.para.id = null;
			$scope.para.name = "IP_BW_" + (new Date()).getTime();
			$scope.para.rx = 50;
			$scope.para.tx = 50;
			$scope.show.title = i18n.spec_term_createIPband_button||"创建IP带宽模板";
			
			$scope.show.create = true;
			$scope.show.win = true;
			$scope.$digest();
        };
		
		$scope.cancel = function (){
			$scope.show.win = false;
			$scope.$digest();
        };
		
		$scope.save = function (){
			if (!$scope.show.check){
				return;
			}
			
			if ($scope.show.create){
				ajax.ipBW.create($scope.para.name, $scope.para.rx, $scope.para.tx, 
					$scope.update, $scope.update);
			}else{
				ajax.ipBW.modify($scope.para.id, $scope.para.name, $scope.para.rx, $scope.para.tx, 
					$scope.update, $scope.update);
			}
			$scope.show.win = false;
			$scope.$digest();
        };

		$scope.change = function(s, l)
		{
			ajax.ipBW.query(s, l, data2table);
		}
						
		function fillList(scope, para)
		{
			scope.table = scope.table || {
				order : [[1,'asc']],
				columns : [
					{sTitle:i18n.common_term_name_label||"名称", mData:"name", "sWidth": "180px", bSortable:false}, 
					{sTitle:"ID", mData:"id", "sWidth": "180px", bSortable:false},
					{sTitle:i18n.perform_term_receiveBandMaxMbps_label||"最大接收带宽(Mbit/s)", "sWidth": "180px", mData:"recvBW", bSortable:false},
					{sTitle:i18n.perform_term_sendBandMaxMbps_label||"最大发送带宽(Mbit/s)", "sWidth": "180px", mData:"sendBW", bSortable:false}
				],
				dataLen : 10,
				total : 0,
				data : [{}],
				operate : [
					{name: i18n.common_term_modify_button||"修改", func: "table.modify"},
					{name: i18n.common_term_delete_button||"删除", func: "table.remove"}
				],
				modify : function(arr, idx){
					$scope.para.id = arr.id;
					$scope.para.name = arr.name;
					$scope.para.rx = arr.recvBW;
					$scope.para.tx = arr.sendBW;
					
					$scope.show.title = i18n.spec_term_modifyIPband_button||"修改IP带宽模板";
					$scope.show.create = false;
					$scope.show.win = true;
				},
				remove : function(arr, idx){
					ajax.confirm(i18n.common_term_confirm_label||"确认删除", 
						i18n.spec_ipBand_del_info_confirm_msg||"确定要删除IP带宽模板?", 
						function(){
							ajax.ipBW.remove(arr.id, $scope.update, $scope.update);
						});
				}
			}
		}
		
		fillList($scope);
		
		function data2table(data)
		{
			if (data && data.ipbwTemplates)
			{
				var i = 0;
				var arr = [];
				for (i = 0; i < data.ipbwTemplates.length; i++)
				{
					var e = data.ipbwTemplates[i];
					
					arr.push({
						id : e.ipBwTemplateId,
						name: e.name,
						recvBW: e.maxRxBandwidth,
						sendBW: e.maxTxBandwidth
					});
				}
			
				$scope.table.data = arr;
				$scope.table.total = data.total;
			}
			else
			{
				$scope.table.data = [];
				$scope.table.total = 0;
			}
			$scope.$apply();
		}
		
		$scope.update = function()
		{
			ajax.ipBW.query(0, 10, data2table);
		}
		
		$scope.update();

    }];

    return ctrl;
});