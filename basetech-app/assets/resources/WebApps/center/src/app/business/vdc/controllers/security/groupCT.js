
define(["tiny-lib/angular",
	"app/business/vdc/services/ajaxSec"], 
	function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", function ($scope) {
		var demo = false;
		
		var i18n = $scope.i18n || {};
		
		$scope.showWin = false;
		$scope.valid = {check:false};
		
		$scope.create = function (){
			$scope.para.name = demo ? ["rule", $scope.table.data.length+1, "before", 0].join("_") : null;
			$scope.table.index = 0;
			$scope.showWin = true;
			$scope.table.insertPrev = false;
			$scope.$digest();
        };
		
		$scope.cancel = function (){
			$scope.showWin = false;
			$scope.$digest();
		};

		$scope.add = function (){

			if (!$scope.valid.check)
			{
				return;
			}
			
			var idx = $scope.table.index;

			if ($scope.table.insertPrev)
			{
				$scope.addPrev([], idx);
			}
			else
			{
				$scope.addNext([], idx);
			}
			
			$scope.showWin = false;
			$scope.$digest();
        };
		
		$scope.addPrev = function(arr, idx){
			if (idx > 0)
			{
				$scope.table.data.splice(idx, 0, para2table());
				$scope.table.data = $scope.table.data.concat();
			}
			else
			{
				$scope.table.data.unshift(para2table());
				$scope.table.data = $scope.table.data.concat();
			}
		};
		
		$scope.addNext = function(arr, idx){
			$scope.table.data.splice(idx + 1, 0, para2table());
			$scope.table.data = $scope.table.data.concat();
		};

		$scope.table = {
			columns : [
                {sTitle: "名称", mData: "name", sWidth: "120px", bSortable: false},
                {sTitle: "协议", mData: "protocol", sWidth: "48px", bSortable: false},
                {sTitle: "起始端口", mData: "sPort", sWidth: "48px", bSortable: false},
                {sTitle: "结束端口", mData: "dPort", sWidth: "48px", bSortable: false},
                {sTitle: "ICMP类型", mData: "icmpType", sWidth: "96px", bSortable: false},
                {sTitle: "源类型", mData: "srcType", sWidth: "72px", bSortable: false},
                {sTitle: "源对象", mData: "srcObj", sWidth: "144px", bSortable: false},
				{sTitle: "目的类型", mData: "dstType", sWidth: "72px", bSortable: false},
                {sTitle: "目的对象", mData: "dstObj", sWidth: "144px", bSortable: false},
				{sTitle: "状态", mData: "status", sWidth: "60px", bSortable: false}
            ],
			operate : [
				{name: "上方插入", func: "table.addPrev"},
				{name: "下方插入", func: "table.addNext"},
				{name: i18n.common_term_delete_button||"删除", func: "table.remove"}
			],
			remove : function(arr, idx)
			{
				$scope.table.data.splice(idx, 1);
				$scope.table.data = $scope.table.data.concat();
			},
			addPrev : function(arr, idx)
			{
				$scope.para.name = demo ? ["rule", $scope.table.data.length+1, "before", idx].join("_") : null;
				$scope.table.index = idx;
				$scope.table.insertPrev = true;
				$scope.showWin = true;
			},
			addNext : function(arr, idx)
			{
				$scope.para.name = demo ? ["rule", $scope.table.data.length+1, "after", idx].join("_") : null;
				$scope.table.index = idx;
				$scope.table.insertPrev = false;
				$scope.showWin = true;
			},
			
            data: [
				{
					name : "",
					protocol : "",
					sPort : "",
					dPort : "",
					icmpType : "",
					srcType : "",
					srcObj : "",
					dstType : "",
					dstObj : "",
					status : ""
				}
            ]
		}
		
		$scope.icmpMap = {
			"Any" : { sPort: "-1", dPort: "-1"},
			"Echo" : { sPort: "8", dPort: "0"},
			"Echo reply" : { sPort: "0", dPort: "0"},
			"Fragment need DF set" : { sPort: "3", dPort: "4"},
			"Host redirect" : { sPort: "5", dPort: "1"},
			"Host TOS redirect" : { sPort: "5", dPort: "3"},
			"Host unreachable" : { sPort: "3", dPort: "1"},
			"Information reply" : { sPort: "16", dPort: "0"},
			"Information request" : { sPort: "15", dPort: "0"},
			"Net redirect" : { sPort: "5", dPort: "0"},
			"Net TOS redirect" : { sPort: "5", dPort: "2"},
			"Net unreachable" : { sPort: "3", dPort: "0"},
			"Parameter problem" : { sPort: "12", dPort: "0"},
			"Port unreachable" : { sPort: "3", dPort: "3"},
			"Protocol unreachable" : { sPort: "3", dPort: "2"},
			"Reassembly timeout" : { sPort: "11", dPort: "1"},
			"Source quench" : { sPort: "4", dPort: "0"},
			"Source route failed" : { sPort: "3", dPort: "5"},
			"Timestamp reply" : { sPort: "14", dPort: "0"},
			"Timestamp request" : { sPort: "4", dPort: "0"},
			"TTL exceeded" : { sPort: "11", dPort: "0"}
		}
		
		$scope.appMap = {};
		
		$scope.icmpPort = {}
		function icmp()
		{
			var arr = [];
			var map = {}
			for (var i in $scope.icmpMap)
			{
				arr.push({id:i});
				var e = $scope.icmpMap[i];
				map[[e.sPort, e.dPort].join()] = i;
			}
			arr[0].checked = true;
			$scope.icmpPort = map;
			return arr;
		}
		
        $scope.form = {
			label : {
				name : "名称:",
				protocol : "协议:",
				icmp: "ICMP类型",
				port : "端口范围:",
				policy : "访问策略:",
				srcType : "源类型:",
				srcObj : "源对象:",
				ip : "IP地址:",
				mask : "子网掩码:",
				sIP : "起始IP:",
				eIP : "结束IP:",
				dstType : "目的类型:",
				dstObj : "目的对象:"
			},
			
			protocol : [
				{id: "TCP", name: "TCP", checked: true},
				{id: "UDP", name: "UDP"},
				{id: "ICMP", name: "ICMP"},
				{id: "Any", name: "Any"}
			],
			
			icmp : icmp(),
		
			policy : [
				{id: "1", name: "允许", checked: true},
				{id: "0", name: "禁止"}
			],
			
			srcType : [
				{id: "AZ", name: "可用分区", checked: true},
				{id: "CLUSTER", name: "资源集群"},
				{id: "VM", name: "虚拟机"},
				{id: "APP", name: "应用"},
				{id: "SUBNET", name: "子网"},
				{id: "IPRANGE", name: "IP段"},
			],
			
			dstType : [
				{id: "AZ", name: "可用分区", checked: true},
				{id: "CLUSTER", name: "资源集群"},
				{id: "VM", name: "虚拟机"},
				{id: "APP", name: "应用"}
			],
	
			subnetCheck : function(s,e){
				return s < e ? true : '结束IP必须大于起始IP';
			}
        }
		
		$scope.srcTable = {
			columns : [
                {sTitle: "对象名称", mData: "name", bSortable: false},
                {sTitle: "对象ID", mData: "id", bSortable: false}
            ],			
            data: [
				{name : "name1", id : "id1"},
				{name : "name2", id : "id2"},
				{name : "name3", id : "id3"},
				{name : "name4", id : "id4"},
				{name : "name5", id : "id5"}
            ]
		}
		
		$scope.dstTable = {
			columns : [
                {sTitle: "对象名称", mData: "name", bSortable: false},
                {sTitle: "对象ID", mData: "id", bSortable: false}
            ],		
            data: [
				{name : "name1", id : "id1"},
				{name : "name2", id : "id2"},
				{name : "name3", id : "id3"},
				{name : "name4", id : "id4"},
				{name : "name5", id : "id5"}
            ]
		}

		$scope.para = {
			name : demo ? "rule" : null,
			protocol : {id:null, name:null},
			icmp : {id:null, name:null},
			sPort : demo ? 10000 : null,
			dPort : demo ? 20000 : null,
			policy : {id:null, name:null},
			srcType : {id:null, name:null},
			srcObj : {},
			ip : demo ? "192.168.1.100" : null,
			mask : demo ? "255.255.255.0" : null,
			sIP : demo ? "192.168.1.100" : null,
			eIP : demo ? "192.168.1.200" : null,
			dstType : {id:null, name:null},
			dstObj : {}
		}
		
		function para2table()
		{
			var e = $scope.para;
			var o = {
				id : e.id,
				name : e.name,
				protocol : e.protocol.id,
				icmpType : "",
				sPort : e.sPort,
				dPort : e.dPort,
				policy : e.policy.id,

				srcType : e.srcType.id,
				srcObj : e.srcObj ? e.srcObj.name : null,
				srcId : e.srcObj ? e.srcObj.id : null,
				dstType : e.dstType.id,
				dstObj : e.dstObj ? e.dstObj.name : null,
				dstId : e.dstObj ? e.dstObj.id : null,
				status : "未保存"
			}
			
			if ('ICMP' == o.protocol)
			{
				o.icmpType = e.icmp.id;
				o.sPort = "";
				o.dPort = "";
			}
			else if ('Any' == o.protocol)
			{
				o.sPort = -1;
				o.dPort = -1;
			}
			
			if ('SUBNET' == o.srcType)
			{
				o.ipRange = e.ip + "/" + e.mask;
				o.srcObj = o.ipRange;
			}
			else if ('IPRANGE' == o.srcType)
			{
				o.ipRange = e.sIP + "-" + e.eIP;
				o.srcObj = o.ipRange;
			}
			else
			{
				o.dstType = o.srcType;
			}

			return o;
		}
		
		// 发送保存请求
		$scope.save = function (){
			var para = {ruleInfos : []};
			
			var arr = para.ruleInfos;
			var i = 0;
			for (;i < $scope.table.data.length;i++)
			{
				var e = $scope.table.data[i];
				var o = {
					"ruleName": e.name,
					"ipProtocol": e.protocol,
					"fromPort": e.sPort,
					"toPort": e.dPort,
					"action": e.policy,
					
					"srcCloudObjectType": e.srcType,
					"srcCloudObjectId": null,
					
					"dstCloudObjectType": e.dstType,
					"dstCloudObjectId": e.dstId,
					
					"priority": i + 1,
					"isDefault": false
				}
				
				if ('ICMP' == e.protocol)
				{
					var port = $scope.icmpMap[e.icmpType];
					if (port)
					{
						o.fromPort = port.sPort;
						o.toPort = port.dPort;
					}
					else
					{
						o.fromPort = -1;
						o.toPort = -1;
					}
				}
				else if ('Any' == e.protocol)
				{
					o.fromPort = -1;
					o.toPort = -1;
				}
				
				if (('IPRANGE' == e.srcType)
					|| ('SUBNET' == e.srcType))
				{
					o["ipRange"] = e.ipRange;
				}
				else
				{
					$scope.para.dstType.id = 'AZ';
					o["srcCloudObjectId"] = e.srcId;
				}
					
				arr.push(o);
			}
			
			arr[arr.length-1].isDefault = true;

			ajax.updateSecRule(para, function(){$scope.update();});
        };
		
		// 查询结果
		$scope.update = function (){
			function data2table(data)
			{
				var statusMap = {
					READY: "正常",
					UPDATING: "保存中",
					UPDATEFAIL: "保存失败",
					DELETEFAIL: "删除失败",
					DELETING: "删除中"
				};
				
				if (data && data.cloudObjectSGRuleInfos)
				{
					var arr = [];
					var i = 0;
					for (; i < data.cloudObjectSGRuleInfos.length; i++)
					{
						var e = data.cloudObjectSGRuleInfos[i];
						var o = {
							id : e.id,
							name : e.ruleName,
							protocol : e.ipProtocol,
							ipRange : e.ipRange,
							policy : e.action,
							sPort : e.fromPort,
							dPort : e.toPort,
							icmpType : "",
							srcType : e.srcCloudObjectType,
							srcObj : e.srcCloudObjectName,
							srcId : e.srcCloudObjectId,
							dstType : e.dstCloudObjectType,
							dstObj : e.dstCloudObjectName,
							dstId : e.dstCloudObjectId,
							status : statusMap[e.status] || "未知"
						}
						
						if (('IPRANGE' == o.srcType)
							|| ('SUBNET' == o.srcType))
						{
							o.srcObj = e.ipRange;
						}
						
						if ('APP' == o.srcType)
						{
							o.srcObj = $scope.appMap[o.srcId];
						}
						
						if ('APP' == o.dstType)
						{
							o.dstObj = $scope.appMap[o.dstId];
						}
						
						if ('ICMP' == o.protocol)
						{
							icmpType : $scope.icmpPort[[e.fromPort, e.toPort].join()];
						}
					
						arr.push(o);
					}
					
					$scope.table.data = arr;
					$scope.$digest();
				}
			}

			// 预查APP名称
			ajax.getAPP(function(data){
				if (data && data.appInstances)
				{
					var i = 0;
					for (;i < data.appInstances.length; i++)
					{
						var e = data.appInstances[i];
						$scope.appMap[e.appId] = e.appName;
					}
				}
				ajax.getSecRule(data2table);
			},function(){
				ajax.getSecRule(data2table);
			}, false);
        };

		$scope.event = {
			protocolChange : function(id, name){
				setTimeout(function(){$scope.$digest()}, 0);
			},
			
			objChange : function(id, name){
				function err(){
					$scope.srcTable.data = [];
					$scope.dstTable.data = [];
					$scope.$digest();
				}
				
				if ('AZ'==id){
					ajax.getAZ(function(data){
						if (data && data.availableZones)
						{
							$scope.srcTable.data = data.availableZones;
							$scope.dstTable.data = data.availableZones;
							$scope.$digest();
						}
						else{
							err();
						}
					},err);
				}
				else if ('CLUSTER'==id){
					ajax.getRC(function(data){
						if (data && data.list && data.list.resourceClusters)
						{
							$scope.srcTable.data = data.list.resourceClusters;
							$scope.dstTable.data = data.list.resourceClusters;
							$scope.$digest();
						}
						else{
							err();
						}
					},err);
				}
				else if ('VM'==id){
					ajax.getVM(function(data){
						if (data && data.vmInfoList)
						{
							$scope.srcTable.data = data.vmInfoList;
							$scope.dstTable.data = data.vmInfoList;
							$scope.$digest();
						}
						else{
							err();
						}
					},err);
				}
				else if ('APP'==id){
					ajax.getAPP(function(data){
						if (data && data.appInstances)
						{
							var i = 0;
							var s = [], d = [];
							for (;i < data.appInstances.length; i++)
							{
								var e = data.appInstances[i];
								s.push({id:e.appId, name:e.appName});
								d.push({id:e.appId, name:e.appName});
								$scope.appMap[e.appId] = e.appName;
							}
							$scope.srcTable.data = s;
							$scope.dstTable.data = d;
							$scope.$digest();
						}
						else{
							err();
						}
					},err);
				}
				else{
					$scope.para.dstType.id = 'AZ';
				}
				setTimeout(function(){$scope.$digest()}, 0);
			}
		}

		$scope.update();
    }];
	
    return ctrl;
});