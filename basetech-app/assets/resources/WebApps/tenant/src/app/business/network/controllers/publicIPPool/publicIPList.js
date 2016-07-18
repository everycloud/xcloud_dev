/**
 * Created on 14-1-26.
 */
/*global define*/
define([
    "tiny-lib/jquery",
    "tiny-widgets/Window",
    "bootstrap/bootstrap.min",
    "tiny-lib/underscore",
    "app/business/network/services/publicIP/publicIPService",
    "app/services/messageService",
    "fixtures/network/publicIP/publicIPFixture"
], function ($, Window, bootstrap, _, ajax, MessageService) {
    "use strict";

    var networkListCtrl = ["$scope", "$compile", "camel", "$state", "$q", "networkCommon", "exception",
        function ($scope, $compile, camel, $state, $q, networkCommon, exception) {
            var user = $scope.user;
            var i18n = $scope.i18n;
            var lang = $scope.urlParams.lang;

            var NETWORK_OPERATE = "570002";
            var privilegeList = user.privilegeList;
            $scope.hasNetworkOperateRight = _.contains(privilegeList, NETWORK_OPERATE);

            $scope.cloudInfraId = networkCommon && networkCommon.cloudInfraId;
            $scope.vpcId = networkCommon && networkCommon.vpcId;
            $scope.azId = networkCommon && networkCommon.azId;

            //硬件路由器类型
            var HARDWARE_ROUTER = 1;
            //软件路由器类型
            var SOFTWARE_ROUTER = 2;

            $scope.openstack = user.cloudType === "ICT";
            $scope.isHardwareRouter = false;
            $scope.hasRouter = true;

            $scope.help = {
                "helpKey": "drawer_pip",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            $scope.show = {
                apply : false
            }
            $scope.para = {
                pulbicIPPool : "",
                allocateType : "",
                publicIP : "",
                puclicIPNum : ""
            };

            $scope.label = {
                publicIPPool : i18n.vpc_term_publicIPpool_label,
                allocateType : i18n.common_term_applyMode_label || "申请方式",
                publicIP : i18n.vpc_term_publicIP_label || "公网IP地址",
                puclicIPNum : i18n.eip_term_publicIPnum_label || "公网IP地址个数"
            };
            $scope.applyIP = {
                pulbicIPPoolValues : [],
                allocateTypeValues : [
                    {id: "1", name: i18n.common_term_designationNo_label || "不指定", checked: true},
                    {id: "2", name: i18n.vm_term_designationIP_label || "指定IP"},
                    {id: "3", name: i18n.common_term_designationNum_label || "指定个数"}
                ],
                poolChange : function(id, name){
                    if ((null == id) || ("" == id)){
                        $scope.para.pulbicIPPool = "";
                        return;
                    }
                },
                IPChange : function(id, name){
                    if ((null == id) || ("" == id)){
                        return;
                    }
                    $scope.$digest();
                }
            };

            $scope.cancel = function () {
                $scope.show.apply = false;
                $scope.$digest();
                $scope.update();
            };

            $scope.create = function () {
                if (!$scope.hasRouter) {
                    new MessageService().okMsgBox(i18n.nat_dnat_add_info_noRouter_msg);
                    return;
                }
                $scope.applyIP.pulbicIPPool = "";
                $scope.para.allocateType = "1";
                $scope.para.publicIP = "";
                $scope.para.puclicIPNum = "";

                var para = {
                    vdcId: $scope.user.vdcId,
                    vpcId :$scope.vpcId,
                    cloudInfraId : $scope.cloudInfraId,
                    azId : $scope.azId
                }
                //硬件路由
                if($scope.isHardwareRouter){
                    //查询公网IP池
                    ajax.net.queryPublicIPPool(para,function(data){
                        var publicIPPools = data.publicIPPools;
                        var pulbicIPPoolValues = [];
                        if( publicIPPools && publicIPPools.length > 0){
                            for( var index in publicIPPools){
                                pulbicIPPoolValues.push(
                                    {
                                        "id":publicIPPools[index].publicIpPoolId,
                                        "name":publicIPPools[index].name
                                    }
                                )
                            }
                            pulbicIPPoolValues[0].checked = true;
                            $scope.applyIP.pulbicIPPoolValues = pulbicIPPoolValues;
                            $scope.$digest();
                        }

                    })
                }
                $scope.show.apply = true;
                $scope.$digest();
            };

            $scope.apply = function () {
                if (!$scope.show.check){
                    return;
                }
                if(3 != $scope.para.allocateType){
                    $scope.para.puclicIPNum = 1
                }else if(2 != $scope.para.allocateType){
                    $scope.para.publicIP = ""

                }else{

                }
                var para = {
                    vdcId: $scope.user.vdcId,
                    vpcId :$scope.vpcId,
                    cloudInfraId : $scope.cloudInfraId,
                    pulbicIPPool : $scope.para.pulbicIPPool,
                    publicIP : $scope.para.publicIP,
                    puclicIPNum : $scope.para.puclicIPNum
                }
                ajax.publicIP.apply(para,$scope.cancel, $scope.cancel);
            };

            $scope.table = {
                columns : [
                    {sTitle: "IP", mData: "ip", bSortable: false},
                    {sTitle: i18n.vpc_term_publicIPpool_label || "公网IP池", mData:"ipPoolName",  bSortable:false},
                    {sTitle: i18n.common_term_usedBy_label || "使用对象", mData: "usage", bSortable: false},
                    {sTitle: i18n.common_term_usageDetail_label || "使用信息", mData: "useInfo", bSortable: false}
                ],
                operate : [
                    {name: "{{!row.usage?'"+(i18n.common_term_release_button||'释放')+"':''}}", func: "table.remove"}
                ],
                remove : function(arr, idx){
                    ajax.confirm(i18n.common_term_confirm_label, i18n.eip_pip_release_info_confirm_msg||"确定释放该公网IP吗？",
                        function(){
                            var para = {
                                vdcId: $scope.user.vdcId,
                                vpcId :$scope.vpcId,
                                cloudInfraId : $scope.cloudInfraId,
                                publicIP : arr.ip
                            }
                            //删除公网IP
                            ajax.publicIP.free(para,$scope.update);
                        });
                },
                data: [],
                dataLen : 10,
                total : 0
            };
            function data2table(data){
                if (data && data.publicIPs){
                    var arr = [];
                    for (var i in data.publicIPs){
                        var publicIP = data.publicIPs[i];
                        var obj = publicIP;
                        var usage =[];
                        var useInfo = [];
                        obj.ipPoolName = publicIP.resourceInfo.resourceName;
                        if(publicIP.usages && publicIP.usages.length > 0){
                            for(var index in publicIP.usages){
                                var item = publicIP.usages[index];
                                if(item.usage){
                                    usage.push("EIP" === item.usage ? (i18n.eip_term_eip_label ||"弹性IP") : item.usage);
                                }
                                if(item.useInfo){
                                    useInfo.push(('zh' === lang) ? item.useInfo[0]:item.useInfo[1]);
                                }
                            }
                        }
                        obj.usage = usage.join(" ");
                        obj.useInfo = useInfo.join(" ");
                        arr.push(obj);
                    }

                    $scope.table.data = arr;
                    $scope.table.total = data.total;
                }
                $scope.$digest();
            }
            $scope.change = function(start, limit)
            {
                var para = {
                    vdcId: $scope.user.vdcId,
                    vpcId :$scope.vpcId,
                    cloudInfraId : $scope.cloudInfraId,
                    start : start,
                    limit : limit
                }
                ajax.publicIP.queryList(para,data2table,data2table);
            }

            $scope.update = function()
            {
                $scope.table.data = [];

                //请求IP池
                var para = {
                    vdcId: $scope.user.vdcId,
                    vpcId :$scope.vpcId,
                    cloudInfraId : $scope.cloudInfraId,
                    azId : $scope.azId,
                    start : 0,
                    limit : $scope.table.dataLen
                }
                //查询路由器
                ajax.net.queryRouter(para,function(data){
                    if (data && data.routers && data.routers.length > 0 && HARDWARE_ROUTER === data.routers[0].routerType && 'READY' === data.routers[0].status) {
                        $scope.isHardwareRouter = true;
                    }else if( data && data.routers && data.routers.length > 0 && SOFTWARE_ROUTER === data.routers[0].routerType && 'READY' === data.routers[0].status){
                        $scope.table.columns[1] = {sTitle:i18n.resource_term_externalNets_label || "外部网络", mData:"ipPoolName", bSortable:false}
                    }else{
                        $scope.hasRouter = false;
                    }
                    ajax.publicIP.queryList(para,data2table);
                });
            }
            $scope.update();

        }
    ];
    return networkListCtrl;
});
