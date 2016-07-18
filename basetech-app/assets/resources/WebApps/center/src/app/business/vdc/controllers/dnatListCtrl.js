
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxNet"], 
	function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", function ($scope) {
		
		var i18n = $scope.i18n || {};
        function fillList(scope, para)
        {
            $scope.table = {
                "columns": [
                    {"sTitle": i18n.vpc_term_publicIP_label||"公网IP", "mData": "ip", sWidth: "120px", "bSortable": false},
                    {sTitle:"ID", mData:"id", "sWidth": "90px", bSortable:false},
                    {"sTitle": i18n.nat_term_publicNetPort_label||"公网端口", "mData": "port", sWidth: "60px", "bSortable": false},
                    {"sTitle": i18n.common_term_status_label||"状态", "mData": "status", sWidth: "60px", "bSortable": false},
                    {"sTitle": i18n.vpc_term_bondObj_label||"绑定对象", "mData": "bindObj", sWidth: "120px", "bSortable": false},
                    {"sTitle": i18n.common_term_privateIP_label||"私有IP", "mData": "privateIP", sWidth: "120px", "bSortable": false},
                    {"sTitle": i18n.common_term_privatePort_label||"私有端口", "mData": "privatePort", sWidth: "60px", "bSortable": false},
                    {"sTitle": i18n.common_term_protocol_label||"协议", "mData": "protocol", sWidth: "60px", "bSortable": false},
                    {"sTitle": i18n.vpc_term_attachVPC_label||"归属VPC", "mData": "vpc", sWidth: "120px", "bSortable": false},
                    {sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
                    {"sTitle": "VPC ID", "mData": "vpcID", sWidth: "150px", "bSortable": false}
                ],
                dataLen : 10,
                total : 0,
                "data": [
                ],
                func : function(scope, status){
                },
                operate : [
                    {name: i18n.common_term_release_button||"释放", func: "table.remove"}
                ],
                remove : function(arr, idx){
                    ajax.confirm(i18n.common_term_confirm_label||"确认释放", i18n.nat_dnat_release_info_confirm_msg||"确定要释放DNAT?",
                        function(){
                            ajax.dnat.remove(arr.id, arr.vpcID,
                                $scope.table.update, $scope.table.update);
                        });
                }
            }
        }
        function data2table(data){
            if (data && data.dnats){
                var arr = [];
                for (var i in data.dnats){
                    var e = data.dnats[i];
                    var o = e;
                    o.id = e.dnatID;
                    o.ip = e.publicIp;
                    o.port = e.publicPort;
                    o.status = {'READY':i18n.common_term_ready_value||"就绪",
                        'PENDING':i18n.common_term_creating_value||"创建中",
                        'DELETING':i18n.common_term_deleting_value||"删除中",
                        'FAIL':i18n.common_term_fail_label||"失败"}[e.status] || e.status;
                    o.bindObj = (e.vmName || "") + "-" + (e.nicName || "");
                    o.privateIP = e.privateIp;
                    o.privatePort = e.privatePort;
                    o.protocol = e.protocol;
                    o.vpc = e.vpcName||""
                    o.vpcID = e.vpcID||"";
                    e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
                    arr.push(o);
                }

                $scope.table.data = arr;
                $scope.table.total = data.total;
            }
            $scope.$digest();
        }
        $scope.change = function(s, l)
        {
            ajax.dnat.get(s,l,data2table);
        }
        fillList($scope);

        $scope.update = function()

        {
            $scope.table.data = [];
            ajax.dnat.get(0,$scope.table.dataLen,data2table);

        }

		
		$scope.update();
    }];
    return ctrl;
});