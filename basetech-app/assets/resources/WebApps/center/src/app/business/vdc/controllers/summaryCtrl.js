
define(["tiny-lib/angular", "app/business/vdc/services/ajaxVPC"], 
function (angular, ajax) {
    "use strict";

    var ctrl = ["$scope", "$state", function ($scope, $state) {
	
		var i18n = $scope.i18n || {};
		
		function fillData(obj, v, name){
			var len = obj.data.length;
			var max = $scope.stat.css.color.length;
			if (len >= max){
				len = max - 1;
			}
			obj.data.push({
				value: v,
				name: name,
				color: $scope.stat.css.color[len]
			});
		}
		
		function fillText(obj){
			var v = 0;
			for (var i in obj.data){
				v += obj.data[i].value;
			}
		
			obj.text = {
				text: "" + v,
				fontSize: 18,
				color: "#999"
			}
		}
		
		$scope.stat = {
			css : {
				R : 32,
				r : 8,
				legend : false,
				width : 64,
				height : 64,
				color : ["#1fbe5c","#f7820d","#f3ce02","#97db10","#1dcfef","#33a6ff","#fe4f88","#db5cff","#d5d5d5"]
			},
			net : {},
			ip : {},
			vpc : {},
			vpn : {},
			router : {},
			sg : {},
			acl : {}
		};

		$scope.statUpdate = function(){
			ajax.net.getStat(function(data){
				$scope.stat.data = data;
				
				var stat = $scope.stat;
				if (data.networkStatistics){
					stat.net.data = [];
					fillData(stat.net, data.networkStatistics.internalNetworkTotalNum, i18n.vpc_term_innerNet_label||"内部网络");
					fillData(stat.net, data.networkStatistics.directConnectedNetworkTotalNum, i18n.vpc_term_directConnectNet_label||"直连网络");
					fillData(stat.net, data.networkStatistics.routingNetworkTotalNum, i18n.vpc_term_routerNet_label||"路由网络");
					fillText(stat.net);
				}
				if (data.publicIpStatistics){
					stat.ip.data = [];
					fillData(stat.ip, data.publicIpStatistics.vpnUsePublicIPTotalNum, "VPN");
					fillData(stat.ip, data.publicIpStatistics.vmUsePublicIPTotalNum, "VM");
					fillData(stat.ip, data.publicIpStatistics.hLBUsePublicIPTotalNum, (i18n.common_term_hardware_label||"硬件")+" LB");
					fillData(stat.ip, data.publicIpStatistics.sLBUsePublicIPTotalNum, (i18n.common_term_software_label||"软件")+" LB");
					fillData(stat.ip, data.publicIpStatistics.privateIpUsePublicIPTotalNum, i18n.common_term_privateNet_label||"私有");
					fillData(stat.ip, data.publicIpStatistics.snatUsePublicIPTotalNum, "SNAT");
					fillData(stat.ip, data.publicIpStatistics.dnatUsePublicIPTotalNum, "DNAT");
					fillData(stat.ip, data.publicIpStatistics.noUsedPublicIPTotalNum, (i18n.common_term_noUse_value||"未用")+'<br>'+i18n.eip_term_eips_label);
					fillText(stat.ip);
				}
				if (data.vpnStatistics){
					stat.vpn.data = [];
					fillData(stat.vpn, data.vpnStatistics.vpnConnectionTotalNum, "VPN");
					fillText(stat.vpn);
				}
				if (data.vpcStatistics){
					stat.vpc.data = [];
					fillData(stat.vpc, data.vpcStatistics.sharedVpcTotalNum, i18n.common_term_share_label||"共享VPC");
					fillData(stat.vpc, data.vpcStatistics.noSharedVpcTotalNum, i18n.common_term_noShare_value||"非共享VPC");
					fillText(stat.vpc);
				}
				if (data.aclStatistics){
					stat.acl.data = [];
					fillData(stat.acl, data.aclStatistics.interDomainAclTotalNum, i18n.common_term_InterDomain_label||"域间");
					fillData(stat.acl, data.aclStatistics.interAclTotalNum, i18n.common_term_InDomain_label||"域内");
					fillText(stat.acl);
				}
				if (data.routerStatistics){
					stat.router.data = [];
					fillData(stat.router, data.routerStatistics.hardRouterTotalNum, i18n.common_term_hardware_label||"硬件");
					fillData(stat.router, data.routerStatistics.softRouterTotalNum, i18n.common_term_software_label||"软件");
					fillText(stat.router);
				}
				if (data.securityGroupStatistics){
					stat.sg.data = [];
					fillData(stat.sg, data.securityGroupStatistics.userSGTotalNum, i18n.common_term_users_label||"用户安全组");
					fillText(stat.sg);
				}
				
				$scope.$digest();
			});
		};
		
		$scope.statUpdate();

        $scope.show = {
            ict : ajax.ict(),
            vpc : false,
            check : false,
            modify : false,
            help : false
        }

        $scope.form = {
            zone:[],
            az:[],
            pri:[
                {id: "1", name: i18n.common_term_high_label||"高"},
                {id: "2", name: i18n.common_term_middling_label||"中"},
                {id: "3", name: i18n.common_term_low_label||"低"},
            ]
        }

        $scope.label = {
            name: (i18n.common_term_name_label||"名称")+":",
            zone: (i18n.resource_term_zone_label||"资源分区")+":",
            az: (i18n.resource_term_AZ_label||"可用分区")+":",
            desp: (i18n.common_term_desc_label||"描述")+":",
            netNum : (i18n.spec_term_directNetMaxNum_label||"最大直连网络个数")+":",
            routerNum : (i18n.spec_term_routerNetMaxNum_label||"最大路由网络个数")+":",
            internalNum : (i18n.spec_term_innerNetMaxNum_label||"最大内部网络个数")+":",
            publicIPNum : (i18n.spec_term_eipMaxNum_label||"最大弹性IP个数")+":",
            pri : (i18n.common_term_priority_label||"优先级")+":",
            bw : (i18n.vpc_term_defaultBandMbps_label||"默认带宽(Mbps)")+":",
            rx : (i18n.vpc_term_routerReceiveBandMbps_label||"路由器接收带宽(Mbps)")+":",
            tx : (i18n.vpc_term_routerSendBandMbps_label||"路由器发送带宽(Mbps)")+":",
            vpcCfgName : (i18n.spec_term_vpcName_label||"VPC规格名称")+":",
            vpcCfgId : (i18n.spec_term_vpcID_label||"VPC规格模板ID")+":"
        }

        $scope.para = {
            vpc : "",
            name : "",
            zone : "",
            az : "",
            desp : "",
            netNum : "",
            routerNum : "",
            internalNum : "",
            publicIPNum : "",
            pri : {id:"",name:""},
            bw : "",
            rx : "",
            tx : "",
            isShared: false
        }

        $scope.create = function(){
            ajax.net.getZone(function(data){
                $scope.form.zone = ajax.net.data2zone(data);
                $scope.$digest();
            });

            $scope.para.name = "";
            $scope.para.desp = "";
            $scope.show.vpc = true;
            $scope.$digest();
        };

        $scope.event = {
            zoneChange : function(id, name){
                ajax.net.getAZ(id, function(data){
                    $scope.form.az = ajax.net.data2az(data);
                    $scope.$digest();
                });
            }
        }

        $scope.save = function(){
            if (!$scope.show.check){
                return;
            }

            ajax.net.create($scope.para.name, $scope.para.az, $scope.para.desp,
                $scope.update,
                $scope.update);
            $scope.show.vpc = false;
            $scope.$digest();
        };

        $scope.modify = function(){
            if (!$scope.show.check){
                return;
            }

            var para = {
                name : $scope.para.name,
                description : $scope.para.desp,
                vpcSpec : {
                    maxDirectNetworkNum : $scope.para.netNum,
                    maxRoutedNetworkNum : $scope.para.routerNum,
                    maxInternalNetworkNum : $scope.para.internalNum,
                    maxPublicIpNum : $scope.para.publicIPNum,
                    priority : $scope.para.pri.id,
                    maxNetworkBandWidth : $scope.para.bw,
                    maxRxThroughput : $scope.para.rx,
                    maxTxThroughput : $scope.para.tx
                }
            }

            ajax.net.modify($scope.para.vpc, para,
                $scope.update,
                $scope.update);
            $scope.show.modify = false;
            $scope.$digest();
        };

        $scope.cancel = function(){
            $scope.show.vpc = false;
            $scope.show.modify = false;
            $scope.$digest();
        };

        function fillList(scope, para)
        {
            scope.table = scope.table || {
                order : [[1,'asc']],
                columns : [
                    {sTitle:i18n.vpc_term_vpcName_label||"VPC名称", mData:"name", "sWidth": "200px", bSortable:false}, 
                    {sTitle:"VPC ID", mData:"vpc", "sWidth": "200px", bSortable:false},
                    {sTitle:(i18n.resource_term_AZ_label||"可用分区"), mData:"az", "sWidth": "200px", bSortable:false, bVisible:!ajax.ict()},
                    {sTitle:(i18n.resource_term_AZ_label||"可用分区")+" ID", mData:"azID", "sWidth": "200px", bSortable:false, bVisible:!ajax.ict()},
                    {sTitle:i18n.common_term_type_label||"类型", mData:"type", "sWidth": "80px", bSortable:false, bVisible:!ajax.ict()}
                ],
                dataLen : 10,
                total : 0,
                data : [],
                operate : [
                    {name: i18n.common_term_modify_button||"修改", func: "table.modify"},
                    {name: '{{row.shared?(i18n.common_term_delete_button||"删除"):""}}',func: "table.remove"}
                ],
                modify : function(arr, idx){
                    $scope.para.vpc = arr.vpc;
                    $scope.para.name = arr.name;
                    $scope.para.desp = arr.description;
                    $scope.para.isShared = arr.shared;
                    if (arr.vpcSpecTemplate){
                        $scope.para.netNum = arr.vpcSpecTemplate.maxDirectNetworkNum;
                        $scope.para.routerNum = arr.vpcSpecTemplate.maxRoutedNetworkNum;
                        $scope.para.internalNum = arr.vpcSpecTemplate.maxInternalNetworkNum;
                        $scope.para.publicIPNum = arr.vpcSpecTemplate.maxPublicIpNum;
                        $scope.para.pri.id = arr.vpcSpecTemplate.priority+"";
                        $scope.para.bw = arr.vpcSpecTemplate.maxNetworkBandWidth;
                        $scope.para.rx = arr.vpcSpecTemplate.maxRxThroughput;
                        $scope.para.tx = arr.vpcSpecTemplate.maxTxThroughput;
                    }else{
                        $scope.para.netNum = "";
                        $scope.para.routerNum = "";
                        $scope.para.internalNum = "";
                        $scope.para.publicIPNum = "";
                        $scope.para.bw = "";
                        $scope.para.rx = "";
                        $scope.para.tx = "";
                    }

                    $scope.show.modify = true;
                },
                remove : function(arr, idx){
                    ajax.confirm(i18n.common_term_confirm_label||"确认删除", i18n.vpc_vpc_del_info_confirm_msg||"确定要删除此VPC？", 
                        function(){
                            ajax.net.remove(arr.vpc, $scope.update, $scope.update);
                        });
                }
            }
        };

        $scope.change = function(s, l)
        {
            ajax.net.query(s, l, data2table);
        }

        fillList($scope);

        function data2table(data)
        {
            if (data && data.vpcs)
            {
                var i = 0;
                var arr = [];
                for (i = 0; i < data.vpcs.length; i++)
                {
                    var e = data.vpcs[i];

                    var az = [], azID = [];
                    for (var m in e.azIDsMapNames)
                    {
                        az.push(e.azIDsMapNames[m]);
                        azID.push(m);
                    }

                    var o = e;
                    o.vpc = e.vpcID;
                    o.name = e.name;
                    o.az = az.join();
                    o.azID = azID.join();
                    o.type = e.shared ? i18n.common_term_share_label||"共享" : i18n.common_term_noShare_value||"非共享";

                    arr.push(o);
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
            if(ajax.ict()){
                $scope.ictQueryVpc();
            }
            else{
                ajax.net.query(0, $scope.table.dataLen, data2table);
            }
        }

        $scope.service = {
            "keystoneId": null
        }
        $scope.$watch("service.keystoneId", function (newVal, oldVal) {
            if (newVal != oldVal) {
                if(ajax.ict()){
                    $scope.ictQueryVpc();
                }
            }
        })

        // ict场景查询VPC
        $scope.ictQueryVpc = function(){
            function data2Vpc(data) {
                if (data && data.projects)
                {
                    var i = 0;
                    var arr = [];
                    for (i = 0; i < data.projects.length; i++)
                    {
                        var e = data.projects[i];
                        var o = {};
                        o.vpc = e.id;
                        o.name = e.name;
                        arr.push(o);
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

            ajax.net.ictQueryVpc($scope.service.keystoneId, data2Vpc);
        }

        $scope.ictInit = function () {
            function data2keystoneId(data) {
                if (data === undefined || data.endpoint === undefined) {
                    return;
                }
                for (var index in data.endpoint) {
                    var regionName = data.endpoint[index].regionName;
                    if (data.endpoint[index].serviceName == "keystone") {
                        $scope.service.keystoneId = data.endpoint[index].id;
                        break;
                    }
                }
            }

            ajax.net.getServiceId(data2keystoneId);
        }

        // 页面初始化
        if(ajax.ict()){
            $scope.ictInit();
        }
        else{
            $scope.update();
        }
    }];

    return ctrl;
});
