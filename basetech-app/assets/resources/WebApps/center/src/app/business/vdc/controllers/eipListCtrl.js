
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxNet"], 
	function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", function ($scope) {

		var i18n = $scope.i18n || {};

		$scope.show = {
			ict : ajax.ict()
		}
        function fillList(scope, para)
        {
            scope.table = scope.table ||{
                "columns": [
                    {"sTitle": "IP", "mData": "ip", sWidth: "120px", "bSortable": false},
                    {sTitle:"ID", mData:"id", "sWidth": "150px", bSortable:false},
                    {"sTitle": i18n.vpc_term_bondStatus_label||"绑定状态", "mData": "bind", sWidth: "80px", "bSortable": false},
                    {"sTitle": i18n.vpc_term_publicIPpool_label||"公网IP池", "mData": "ipPool", sWidth: "120px", "bSortable": false},
                    {"sTitle": i18n.vpc_term_bondObj_label||"绑定对象", "mData": "bindObj", sWidth: "120px", "bSortable": false},
                    {"sTitle": i18n.common_term_privateIP_label||"私有IP", "mData": "privateIP", sWidth: "120px", "bSortable": false},
                    {"sTitle": i18n.vpc_term_attachVPC_label||"归属VPC", "mData": "vpcName", sWidth: "120px", "bSortable": false},
                    {sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
                    {"sTitle": i18n.vpc_term_modifyBandStatus_label||"带宽修改状态", "mData": "status", sWidth: "80px", "bSortable": false}
                ],
                dataLen : 10,
                total : 0,
                "data":[],
                func : function(scope, status){
                },
                operate : [
                    {name: "{{'VPN'!=row.usedType?'"+(i18n.common_term_release_button||'释放')+"':''}}", func: "table.remove"}
                ],
                unbind : function(arr, idx){
                    ajax.confirm(i18n.common_term_confirm_label||"确认解绑定", i18n.common_term_unbondConfirm_msg||"确定要解绑定?",
                        function(){
                            ajax.eip.unbind(arr.id,
                                $scope.update, $scope.update);
                        });
                },
                modify : function(arr, idx){

                },
                remove : function(arr, idx){
                    ajax.confirm(i18n.common_term_confirm_label||"确认释放", i18n.eip_eip_release_info_confirm_msg||"确定要释放弹性IP?",
                        function(){
                            ajax.eip.remove(arr.id, arr.vpc,
                                $scope.update, $scope.update);
                        });
                }
            }
        }
        function data2table(data){
            if (data && data.elasticIPs){
                var arr = [];
                for (var i in data.elasticIPs){
                    var e = data.elasticIPs[i];
                    var o = e;
                    o.ip = e.ip;
                    o.bind = 'BIND' == e.resourceStatus ? i18n.common_term_bonded_value||"已绑定" : i18n.common_term_noBond_value||"未绑定";
                    o.ipPool = e.publicIPPoolName;
                    o.bindInfo = e.bindInfo;
                    if("VM" == e.bindInfo.usedType || "SLB" == e.bindInfo.usedType){
                        o.bindObj = e.bindInfo.parentResourceName||"";
                    }else{
                        o.bindObj = e.bindInfo.resourceName ||"";
                    }
                    o.privateIP = e.bindInfo.resourceIP;
                    o.vpc = e.vpcID;
                    o.shareVpc = e.shareVpc;
                    e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" :(e.vpcID ?i18n.common_term_noShare_value||"非共享":"");
                    o.status = {'SUCCESS':i18n.common_term_modifySucceed_value||"修改成功",
                        'UPDATING':i18n.common_term_modifing_value||"修改中",
                        'FAIL':i18n.common_term_modifyFail_value||"修改失败"}[e.bandwidthStatus] || e.bandwidthStatus;
                    arr.push(o);
                }

                $scope.table.data = arr;
                $scope.table.total = data.total;
            }
            $scope.$digest();
        }

        $scope.change = function(s, l)
        {
            ajax.eip.get(s, l, data2table);
        }

        fillList($scope);

        $scope.update = function()
        {
            $scope.table.data = [];
            ajax.eip.get(0,$scope.table.dataLen,data2table);
        }
		$scope.update();
    }];
    return ctrl;
});