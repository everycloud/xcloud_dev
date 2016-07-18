
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxSec"], 
	function (angular, ajax) {
	"use strict";

	var ctrl = ["$scope", function ($scope) {
	
		var i18n = $scope.i18n || {};
		
		var demo = false;

        $scope.para = {
            ruleID : "",
            vpcID : ""
        }
		$scope.show = {
			rule : false,
			vm : false
		}
		
		$scope.form = {
		}
		
		$scope.table = {
			columns : [
				{sTitle: i18n.common_term_name_label||"名称", mData: "name", sWidth: "80px", bSortable: false},
				{sTitle: "ID", mData: "id", sWidth: "150px", bSortable: false},
				{sTitle: i18n.virtual_term_ruleNum_label||"规则数", mData: "rule", sWidth: "48px", bSortable: false},
				{sTitle: i18n.common_term_memberNum_label||"成员数", mData: "vm", sWidth: "48px", bSortable: false},
				{sTitle: i18n.security_term_GroupSharing_label||"组内互通", mData: "interflow", sWidth: "48px", bSortable: false},
				{sTitle: i18n.vpc_term_attachVPC_label||"归属VPC", mData: "vpcName", sWidth: "180px", bSortable: false},
				{sTitle: i18n.vpc_term_vpcType_label||"VPC类型", mData:"vpcType", "sWidth": "60px", bSortable:false},
				{sTitle: "VPC ID", mData: "vpc", sWidth: "180px", bSortable: false},
				{sTitle: i18n.common_term_desc_label||"描述", mData: "desp", sWidth: "180px", bSortable: false}
			],
			operate : [
				{name: i18n.common_term_delete_button||"删除", func: "table.remove"}
			],
			remove : function(arr, idx){
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", "确定要删除安全组?", 
					function(){
						ajax.sec.remove(arr.id, arr.vpc, 
							$scope.update, $scope.update);
					});
			},
            dataLen : 10,
            total : 0,
			data: []
		}

		$scope.ruleTable = {
			columns : [
                {sTitle: "ID", mData: "id", sWidth: "100px", bSortable: false},
				{sTitle: i18n.common_term_protocol_label||"协议", mData: "protocol", sWidth: "60px", bSortable: false},
				{sTitle: i18n.common_term_source_label||"源", mData: "ip", sWidth: "180px", bSortable: false},
				{sTitle: i18n.common_term_IPtype_label||"IP类型", mData: "type", sWidth: "60px", bSortable: false},
				{sTitle: i18n.common_term_initiativePort_label||"起始端口", mData: "sPort", sWidth: "60px", bSortable: false},
				{sTitle: i18n.common_term_endPort_label||"结束端口", mData: "dPort", sWidth: "60px", bSortable: false},
				{sTitle: "ICMP", mData: "icmp", sWidth: "120px", bSortable: false},
				{sTitle: i18n.common_term_status_label||"状态", mData: "status", sWidth: "60px", bSortable: false}
			],
			operate : [
				{name: i18n.common_term_delete_button||"删除", func: "ruleTable.remove"}
			],
			remove : function(arr, idx){
				function fin(){
					$scope.updateRule();
					$scope.update();
				}
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.security_rule_del_info_confirm_msg||"确定要删除规则?", function(){
					ajax.sec.delRule({deleteSGRule:{
						sgID : $scope.para.ruleID,
						sgRuleIdList : [arr.id]
					}}, $scope.para.vpcID,
					fin, fin);
				});
			},
            dataLen : 10,
            total : 0,
			data: []
		}
        function data2ruleTable(data){
            if (data && data.rules){
                var arr = [];
                for (var i in data.rules){
                    var e = data.rules[i];
                    var o = {
                        id : e.ruleID,
                        protocol : e.ipProtocol,
                        ip : e.ipRange ? e.ipRange : e.allowedSGID,
                        type : "IPv" + (e.ipVersion||4),
                        sPort : -1 == e.fromPort ? '-' : e.fromPort,
                        dPort : -1 == e.toPort ? '-' : e.toPort,
                        icmp : ajax.icmp.getName(e.fromPort, e.toPort),
                        status : ajax.icmp.getStatus(e.status)
                    }
                    if ("ICMP" == e.ipProtocol){
                        o.sPort = "-";
                        o.dPort = "-";
                    }else{
                        o.icmp = "-"
                    }
                    arr.push(o);
                }

                $scope.ruleTable.data = arr;
                $scope.ruleTable.total = data.total;
            }
            $scope.$digest();
        }
        $scope.updateRule = function (ruleID, vpcID){
            $scope.para.ruleID = ruleID;
            $scope.para.vpcID = vpcID;
            $scope.ruleTable.data = [];
            ajax.sec.getRule(ruleID, vpcID, 0, $scope.ruleTable.dataLen, data2ruleTable);
        }

        $scope.changeRule = function(start, limit)
        {
            ajax.sec.getRule($scope.para.ruleID, $scope.para.vpcID, start, limit, data2ruleTable);
        }
		
		$scope.vmTable = {
			columns : [
				{sTitle: i18n.common_term_name_label||"名称", mData: "name", sWidth: "120px", bSortable: false},
				{sTitle: "ID", mData: "id", sWidth: "150px", bSortable: false},
				{sTitle: i18n.common_term_floatIP_label||"浮动IP", mData: "ip", sWidth: "120px", bSortable: false},
				{sTitle: i18n.common_term_NIC_label||"网卡", mData: "nic", sWidth: "240px", bSortable: false}
			],
			operate : [
				{name: i18n.common_term_delete_button||"删除", func: "vmTable.remove"}
			],
			remove : function(arr, idx){
				function fin(){
					$scope.vmTable.update();
					$scope.update();
				}
				ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.security_group_delMemberVM_info_confirm_msg||"确定要删除成员虚拟机?", function(){
					ajax.sec.delVM(arr.id, $scope.vmTable.vpc,
						fin, fin
					);
				});
			},
			data: [
				{}
			],
			update : function (id, vpc){
				$scope.vmTable.data = [];
				
				function data2table(data){
					if (data && data.querySGMemberResp && data.querySGMemberResp.vms){
						var arr = [];
						for (var i in data.querySGMemberResp.vms){
							var e = data.querySGMemberResp.vms[i];
							var o = {
								id : e.vmID,
								ip : [],
								name : e.vmName,
								nic : []
							}
							for (var j in e.vnics){
								var nic = e.vnics[j];
								o.ip.push(nic.floatIP);
								o.nic.push(nic.ip, nic.ipv6s||[],
									"(" + e.vnics[j].nicID + ")");
							}
							o.ip = o.ip.join(";");
							o.nic = o.nic.join(";");
							arr.push(o);
						}
						
						$scope.vmTable.data = arr;
					}
					$scope.$digest();
				}
				ajax.sec.getVM(id||$scope.vmTable.id, vpc||$scope.vmTable.vpc, data2table);
			}
		}

        function data2table(data){
            if (data && data.sgs){
                var arr = [];
                for (var i in data.sgs){
                    var e = data.sgs[i];
                    var o = {
                        id : e.sgID,
                        name : e.name,
                        rule : e.sgRuleCount,
                        vm : e.sgMemberCount,
                        interflow : 1 == e.intraTrafficAllow ? i18n.common_term_Interconnection_value||"互通" : i18n.common_term_notconnect_value||"不互通",
                        vpc : e.vpcID,
                        desp : e.description
                    }
                    o.vpcName = e.vpcName;
                    o.vpcType = e.shareVpc ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";
                    arr.push(o);
                }

                $scope.table.data = arr;
                $scope.table.total = data.total;
            }
            $scope.$digest();
        }
		
		// 查询结果
		$scope.update = function (){
			$scope.table.data = [];
			ajax.sec.get(0,$scope.table.dataLen,data2table);
		};

		$scope.event = {
		}
        $scope.change = function(s, l)
        {
            ajax.sec.get(s, l, data2table);
        }

		$scope.update();
	}];
	
	return ctrl;
});