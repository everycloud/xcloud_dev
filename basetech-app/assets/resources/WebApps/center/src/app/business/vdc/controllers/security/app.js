
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxSec"], 
	function (angular, ajax) {
	"use strict";

	var ctrl = ["$scope", function ($scope) {
		
		var i18n = $scope.i18n || {};
		
		$scope.table = {
			columns : [
				{sTitle: i18n.vpc_term_attachVPC_label||"归属VPC", mData: "name", sWidth: "60px", bSortable: false},
				{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
				{sTitle: "VPC ID", mData: "id", sWidth: "100px", bSortable: false},
				{sTitle: "DNS", mData: "dns", sWidth: "36px", bSortable: false},
				{sTitle: "FTP", mData: "ftp", sWidth: "36px", bSortable: false},
				{sTitle: "ILS", mData: "ils", sWidth: "36px", bSortable: false},
				{sTitle: "MSN", mData: "msn", sWidth: "36px", bSortable: false},
				{sTitle: "QQ", mData: "qq", sWidth: "36px", bSortable: false},
				{sTitle: "H323", mData: "h323", sWidth: "36px", bSortable: false},
				{sTitle: "NETBIOS", mData: "netbios", sWidth: "36px", bSortable: false},
				{sTitle: "SIP", mData: "sip", sWidth: "36px", bSortable: false},
				{sTitle: "MGCP", mData: "mgcp", sWidth: "36px", bSortable: false},
				{sTitle: "MMS", mData: "mms", sWidth: "36px", bSortable: false},
				{sTitle: "RTSP", mData: "rtsp", sWidth: "36px", bSortable: false},
				{sTitle: "PPTP", mData: "pptp", sWidth: "36px", bSortable: false},
				{sTitle: "SQLNET", mData: "sqlnet", sWidth: "36px", bSortable: false}
			],
			data: [
				{
				}
			]
		}
		
		// 查询结果
		$scope.update = function (){
			$scope.table.data = [];
			
			function data2table(data){
				if (data && data.aspfInfos){
					var arr = [];
					for (var i in data.aspfInfos){
						var e = data.aspfInfos[i];
						var o = e;
						o.id = e.vpcID;
						o.name = e.vpcName;
						e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
						arr.push(o);
					}
					
					$scope.table.data = arr;
				}
				$scope.$digest();
			}
			ajax.sec.getApp(data2table);
		};

		$scope.update();
	}];
	
	return ctrl;
});