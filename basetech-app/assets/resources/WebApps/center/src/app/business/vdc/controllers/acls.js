
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxNet"], 
	function (angular, ajax) {
	"use strict";

	var ctrl = ["$scope", function ($scope) {
		var demo = false;
		
		var i18n = $scope.i18n || {};
		
		$scope.show = {
			detail : false
		}
        $scope.para = {
            vpcID : "",
            type : "",
            aclid : ""
        }
		
		$scope.table = {
			columns : [
				{sTitle: i18n.acl_term_acl_label||"类型", mData: "type", sWidth: "120px", bSortable: false},
                {sTitle:"ID", mData:"id", "sWidth": "120px", bSortable:false},
                {sTitle: i18n.vpc_term_attachVPC_label||"归属VPC", mData: "vpc", sWidth: "120px", bSortable: false},
				{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
				{sTitle: "VPC ID", mData: "vpcID", sWidth: "180px", bSortable: false},
				{sTitle: i18n.virtual_term_ruleNum_label||"规则数目", mData: "rule", sWidth: "120px", bSortable: false}
			],
            dataLen : 10,
            total : 0,
			data: [],
			remove : function(arr, idx){
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.security_rule_del_info_confirm_msg||"确定要删除规则?", 
					function(){
						ajax.acls.remove(arr.id, arr.vpcID,
							function(){
                                $scope.updateAcls();
								$scope.updateAcls();
							});
					});
			}
		}

		$scope.inTable = {
			columns : [
                {sTitle: "ID", mData: "id", sWidth: "100px", bSortable: false},
				{sTitle: i18n.common_term_status_label||"状态", mData: "status", sWidth: "60px", bSortable: false},
				{sTitle: i18n.common_term_Number_label||"编号", mData: "pri", sWidth: "40px", bSortable: false},
				{sTitle: i18n.common_term_protocol_label||"协议", mData: "protocol", sWidth: "60px", bSortable: false},
				{sTitle: i18n.vpc_term_net_label||"网络", mData: "net", sWidth: "120px", bSortable: false},
				{sTitle: i18n.common_term_IPandMask_label||"IP地址/掩码", mData: "ip", sWidth: "220px", bSortable: false},
				{sTitle: i18n.vpc_term_targetPortRange_label||"目的端口范围", mData: "range", sWidth: "120px", bSortable: false},
				{sTitle: i18n.acl_term_ICMPtype_label||"ICMP类型", mData: "icmp", sWidth: "100px", bSortable: false},
				{sTitle: i18n.common_term_policy_label||"策略", mData: "act", sWidth: "60px", bSortable: false}
			],
            dataLen : 10,
            total : 0,
			data: [	],
			operate : [
				{name: '{{table.shareVpc?(i18n.common_term_delete_button||"删除"):""}}', func: "table.remove"}
			]
		}
		
		$scope.outTable = {
			columns : $scope.inTable.columns,
            dataLen : 10,
            total : 0,
			data: [	],
			operate : $scope.inTable.operate
		}

        function data2table(data){
            if (data && data.acls){
                var arr = [];
                for (var i in data.acls){
                    var e = data.acls[i];
                    var o = e;
                    o.id = e.aclID;
                    o.type = {1:i18n.common_term_InDomain_label||"域内",2:i18n.common_term_InterDomain_label||"域间"}[e.aclType] || e.aclType;
                    o.rule = e.totalRules;
                    o.vpc = e.vpcName||"";
                    o.vpcID = e.vpcID||"";
                    e.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
                    arr.push(o);
                }

                $scope.table.data = arr;
                $scope.table.total = data.total;
            }
            $scope.$digest();
        }

        function data2ruleTable(data){
            if (data && data.firewallRules){
                var arrOut = [];
                var arrIn = [];
                for (var i in data.firewallRules){
                    var e = data.firewallRules[i];
                    var o = e;
                    o.id = e.firewallRuleID;
                    o.status = {'READY':i18n.common_term_ready_value||"就绪",
                        'PENDING':i18n.common_term_creating_value||"创建中",
                        'DELETING':i18n.common_term_deleting_value||"删除中",
                        'FAIL':i18n.common_term_fail_label||"失败"}[e.status] || e.status;
                    o.pri = e.ruleID;
                    o.protocol = e.protocol;
                    o.net = 1 == $scope.para.type ? (e.networkName||""):(e.eipAddr||"");
                    o.ip = e.ipAddr + "/" + e.ipPrefix;
                    o.sPort = (null==e.startPort?"":e.startPort);
                    o.dPort = (null==e.endPort?"":e.endPort);
                    o.range = o.sPort + "-" + o.dPort;
                    o.icmp = ajax.icmp.getName(e.icmpType,e.icmpCode);
                    o.act = {permit:i18n.common_term_allow_value||"允许",deny:i18n.common_term_refuse_value||"拒绝"}[e.action]||e.action;

                    if (1 == e.direction){
                        arrIn.push(o);
                    }else if (2 == e.direction){
                        arrOut.push(o);
                    }
                }

                if (arrIn.length > 0){
                    $scope.inTable.data = arrIn;
                    $scope.inTable.total = data.total;
                }
                if (arrOut.length > 0){
                    $scope.outTable.data = arrOut;
                    $scope.outTable.total = data.total;
                }
            }
            $scope.$digest();
        }
        $scope.updateRule = function (id, type, aclid){
            $scope.inTable.data = [];
            $scope.outTable.data = [];
            $scope.para.vpcID = id;
            $scope.para.type = type;
            $scope.para.aclid = aclid;

            ajax.acls.getRule(id, 1, type, aclid, 0,$scope.inTable.dataLen, data2ruleTable);
            ajax.acls.getRule(id, 2, type, aclid, 0,$scope.outTable.dataLen, data2ruleTable);
        }

        $scope.updateAcls = function (){
            $scope.table.data = [];
            ajax.acls.get(0,$scope.table.dataLen, data2table);
        }

        $scope.changeAcls = function(start, limit)
        {
            ajax.acls.get(start, limit, data2table);
        }

        $scope.changeRuleIn = function(start, limit)
        {
            ajax.acls.getRule($scope.para.vpcID, 1, $scope.para.type, $scope.para.aclid, start, limit, data2ruleTable);
        }

        $scope.changeRuleOut = function(start, limit)
        {
            ajax.acls.getRule($scope.para.vpcID, 2, $scope.para.type, $scope.para.aclid, start, limit, data2ruleTable);
        }

		$scope.updateAcls();
	}];
	
	return ctrl;
});