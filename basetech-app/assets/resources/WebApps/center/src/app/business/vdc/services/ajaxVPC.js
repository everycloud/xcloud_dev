
define(["app/services/ajaxBase",
    "fixtures/network/router/routerFixture",
    "fixtures/network/vpcFixture",
    "fixtures/vpcFixture"], 
function (ajax) {
    "use strict";
    
    ajax.net = {    
        // VPCResource
        query : function(s, l, onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/1/vpcs?start=" + s + "&limit=" + l);
            
            ajax.finish(ret, onOK, onErr);
        },
        
        getStat : function(onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/capacity-statistics/resource-networks");
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2vpc : function (data)
        {
            if (data && data.vpcs)
            {                
                var i = 0, arr = [];
                for (i = 0; i < data.vpcs.length; i++)
                {
                    var e = data.vpcs[i];
                    arr.push({id: e.vpcID, name: e.name});
                }
                if (i > 0){
                    arr[0].checked = true;
                }
                return arr;
            }

            return [];
        },
        
        getVPC : function(az, onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs?start={start}&limit={limit}&shared=true&availablezone={availablezone}", 
                {
                    "tenant_id": ajax.user().orgId,
                    start: 0,
                    limit: 100,
                    availablezone: az
                });
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2zone : function (data)
        {        
            if (data && data.zones)
            {
                var i = 0, arr = [];
                for (i = 0; i < data.zones.length; i++)
                {
                    var e = data.zones[i];
                    arr.push({id: e.id , name: e.name});
                }
                if (i > 0){
                    arr[0].checked = true;
                }
                return arr;
            }
            return [];
        },
        
        getZone : function(onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/1/zones");
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2az : function (data)
        {
            if (data && data.availableZones)
            {
                var i = 0, arr = [];
                for (i = 0; i < data.availableZones.length; i++)
                {
                    var e = data.availableZones[i];
                    arr.push({id: e.id , name: e.name});
                }
                if (i > 0){
                    arr[0].checked = true;
                }
                return arr;
            }
            return [];
        },
        
        getAZ : function(zone, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/1/availablezones/list",
                {},
                {
                    "zoneId": zone,
                    "start": 0,
                    "limit": 10
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        create : function(name, az, disp, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/1/vpcs",
                {},
                {
                    "name": name,
                    "azIDs": [az],
                    "description": disp,
                    "shared": true
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        remove : function(id, onOK, onErr)
        {
            var ret = ajax.send("delete",
                "/goku/rest/v1.5/irm/1/vpcs/" + id);
            
            ajax.finish(ret, onOK, onErr);
        },
        
        modify : function(id, para, onOK, onErr)
        {
            var ret = ajax.send("put",
                "/goku/rest/v1.5/irm/1/vpcs/" + id,
                {},
                para
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        // 网络 OrgNetworkResource
        queryNet : function(s, l, p, onOK, onErr)
        {
            var ret = ajax.send("get",
                (p && p.id) ? 
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks/{id}?start={start}&limit={limit}":
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks?start={start}&limit={limit}",
                {
                    "tenant_id": 1,
                    vpcid : p ? (p.vpc || -1) : -1,
                    id : p ? (p.id || -1) : -1,
                    start : s,
                    limit : l
                },p
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        createNet : function(para, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/networks",
                {
                    "tenant_id": 1
                },
                {
                    vpcID : para.vpc,
                    azID : para.az,
                    name : para.name,
                    vlan : para.vlan,
                    description : para.desp,
                    extNetworkId: para.netID,
                    dirctNetwork: para.dirctNetwork,
                    routed: para.router,
                    subnet:
                    {
                        ipAllocatePolicy: para.ipType,
                        subnetAddr: para.subnet,
                        subnetPrefix: para.mask,
                        gateway: para.gateway,
                        availableIPRanges: para.ipRange,
                        dhcpOption: para.dhcpOption
                    },
                    portSetting: para.portSetting
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        removeNet : function(id, vpc, onOK, onErr)
        {
            var ret = ajax.send("delete",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks/" + id,
                {
                    "tenant_id": 1,
                    vpcid: vpc
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        modifyNet : function(para, onOK, onErr)
        {
            var paraIds={
                vpcId : para.vpc,
                networkId : para.id
            };
            var para = {
                name : para.name,
                description : para.desp,
                dirctNetwork: para.dirctNetwork,
                portSetting: para.portSetting
            };
            
            if (para.shareVpc){
                para.subnet = {
                    ipAllocatePolicy: para.ipType,
                    subnetAddr: para.subnet,
                    subnetPrefix: para.mask,
                    gateway: para.gateway,
                    availableIPRanges: para.ipRange,
                    dhcpOption: para.dhcpOption
                }
            }
            
            var ret = ajax.send("put",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/networks/" + paraIds.networkId,
                {
                    "tenant_id": 1,
                    vpcid: paraIds.vpcId
                },
                para
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        getVM : function(netId, s, l, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/vms/list",
                {
                    "tenant_id": 1
                },
                {
                    networkId : netId,
                    offset : s,
                    limit : l
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        getIP : function(netId, vpc, auto, onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/privateips",
                {
                    "tenant_id": 1,
                    vpcid : vpc
                },
                {
                    networkid : netId,
                    allocateType : auto ? "AUTO" : "MANUAL",
                    start : 0,
                    limit : 100
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2extNet : function (data)
        {
            if (data && data.queryAvailabeExNetworkResp 
                && data.queryAvailabeExNetworkResp.externalNetworks)
            {
                var i = 0;
                var arr = [];
                for (i = 0; i < data.queryAvailabeExNetworkResp.externalNetworks.length; i++)
                {
                    var e = data.queryAvailabeExNetworkResp.externalNetworks[i];
                    e.id = e.exnetworkID;
                    e.vlan = e.vlans.join();
                    e.subNet = e.ipv4Subnet ? e.ipv4Subnet.subnetAddr : 
                        (e.ipv6Subnet ? e.ipv6Subnet.subnetAddr : "");
                    arr.push(e);
                }
                
                return arr;
            }
            return [];
        },
        // QueryAvailableExNetworkReq 
        getExtNet : function(para, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/external-networks/action",
                {
                    "tenant_id": 1
                },
                {
                    queryAvailableExNetworkReq: {
                        vpcID : para.vpc,
                        start : 0,
                        limit : 100,
                        usedByShareNet : true,
                        usedByRouter : para.router,
                        usedByVxlanRouter : para.vxlan
                    }
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2router : function (data)
        {
            if (data && data.routers)
            {
                var i = 0;
                var map = {};
                for (i = 0; i < data.routers.length; i++)
                {
                    var e = data.routers[i];
                    map[e.vpcID] = e;
                }
                
                return map;
            }
            
            return {};
        },
        
        // RouterResource
        getRouter : function(vpc, onOK, onErr)
        {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/routers",
                {
                    "tenant_id": 1,
                    vpcid: vpc
                }
            );
            
            ajax.finish(ret, onOK, onErr, false);
        },
        
        createRouter : function(para, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/routers",
                {
                    "tenant_id": 1,
                    vpcid: para.vpc
                },
                {
                    vpcID : para.vpc,
                    azID : para.az,
                    maxRxThroughput : para.rx,
                    maxTxThroughput : para.tx,
                    externalNetworkID: para.netID,
                    routerType : para.routerType,
                    enableSnat : para.enableSnat,
                    supportVxlanFlag : para.supportVxlanFlag
                });
            
            ajax.finish(ret, onOK, onErr);
        },
        
        removeRouter : function(id, vpc, onOK, onErr)
        {
            var ret = ajax.send("delete",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/routers/" + id,
                {
                    "tenant_id": 1,
                    vpcid : vpc
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        modifyRouter : function(para, onOK, onErr)
        {
            var ret = ajax.send("put",
                "/goku/rest/v1.5/irm/{tenant_id}/routers/" + para.router,
                {
                    "tenant_id": 1,
                },
                {
                    enableSnat : para.enableSnat
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        data2vlan : function (data)
        {
            if (data && data.queryVlanPoolResp && data.queryVlanPoolResp.vlanpools)
            {
                var i = 0;
                var arr = [];
                for (i = 0; i < data.queryVlanPoolResp.vlanpools.length; i++)
                {
                    var e = data.queryVlanPoolResp.vlanpools[i];
                    arr.push({
                        name : e.name,
                        id : e.id,
                        start: e.startID,
                        end: e.endID
                    });
                }
                
                return arr;
            }
            return [];
        },
        
        getVLAN : function(para, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/vlanpools/action",
                {
                    "tenant_id": 1
                },
                {
                    queryNetworkVlanPoolReq :{
                        vpcID : para.vpc,
                        azID: para.az,
                        usedBySubnet : true
                    }
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        addSNAT : function(vpc, net, onOK, onErr)
        {
            var ret = ajax.send("post",
                "/goku/rest/v1.5/irm/{tenant_id}/snats",
                {
                    "tenant_id": 1
                },
                {
                    vpcID : vpc,
                    networkID : net
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },
        
        rmvSNAT : function(id, vpc, onOK, onErr)
        {
            var ret = ajax.send("delete",
                "/goku/rest/v1.5/irm/{tenant_id}/vpcs/{vpcid}/snats/{id}",
                {
                    "tenant_id": 1,
                    id : id,
                    vpcid : vpc
                }
            );
            
            ajax.finish(ret, onOK, onErr);
        },

        // 获取服务访问点列表
        getServiceId: function (onOK, onErr) {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/openstack/endpoint",
                {}, {});
            ajax.finish(ret, onOK, onErr);
        },
        ictQueryVpc: function (serviceId, onOK, onErr) {
            var ret = ajax.send("get",
                "/goku/rest/v1.5/token",
                {}, {"user-id": ajax.user().id});

            ajax.finish(ret, function (data) {
                if (data === undefined) {
                    return;
                }
                var tokenId = data.id;
                var projectId = data.projectId;

                var ret = ajax.send("get",
                    "/goku/rest/v1.5/openstack/{redirect_address_id}/v3/projects",
                    {redirect_address_id: serviceId}, {}, {token: tokenId});
                ajax.finish(ret, onOK, onErr);
            }, onErr);
        }
    };
    
    return ajax;
});