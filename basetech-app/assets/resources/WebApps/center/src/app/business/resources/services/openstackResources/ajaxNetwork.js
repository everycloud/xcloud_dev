define(["app/services/ajaxBase",
    "fixtures/dataCenterFixture"],
    function (ajax, fixture) {
        "use strict";
        ajax.network = {
            getServiceId: function (onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/openstack/endpoint",
                    {}, {});
                ajax.finish(ret, onOK, onErr);
            },
            queryNetworks: function (serviceId, params, onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks?shared=true&router:external=true",
                        {redirect_address_id: serviceId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },
            createNetwork: function (serviceId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    if (params.network) {
                        params.network.shared = true;
                        params.network.admin_state_up = true;
                        params.network["router:external"] = true;
                        params.network.tenant_id = projectId;
                    }
                    var ret = ajax.send("post",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks",
                        {redirect_address_id: serviceId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            modifyNetwork: function (serviceId, networkId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;

                    var ret = ajax.send("put",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks/{id}",
                        {redirect_address_id: serviceId, id: networkId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            deleteNetwork: function (serviceId, networkId, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    var ret = ajax.send("delete",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks/{network_id}",
                        {redirect_address_id: serviceId, network_id: networkId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
                ajax.finish(ret, onOK, onErr);
            },
            querySubnets: function (serviceId, networkId, onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets?network_id={network_id}",
                        {redirect_address_id: serviceId, network_id: networkId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            createSubnet: function (serviceId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;

                    var ret = ajax.send("post",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets",
                        {redirect_address_id: serviceId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            modifySubnet: function (serviceId, subnetId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;

                    var ret = ajax.send("put",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets/{id}",
                        {redirect_address_id: serviceId, id: subnetId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            deleteSubnet: function (serviceId, subnetId, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;

                    var ret = ajax.send("delete",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets/{id}",
                        {redirect_address_id: serviceId, id: subnetId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            /**
             * 查询VLAN
             */
            queryVlans: function (serviceId,onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/physicalnetworks",
                        {redirect_address_id: serviceId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },


            /**
             * 创建MacPool
             */
            createMacPool: function (serviceId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    var ret = ajax.send("post",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macpools",
                        {redirect_address_id: serviceId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },
            /**
             * 创建MacRange
             */
            createMacRange: function (serviceId, params, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    var ret = ajax.send("post",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macranges",
                        {redirect_address_id: serviceId}, params, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },

            /**
             * 查询MacPoolRange
             */
            queryMacPoolRange: function (serviceId, onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macranges",
                        {redirect_address_id: serviceId}, {},{token: tokenId});
                    ajax.finish(ret, function(data1){
                        var ret = ajax.send("get",
                            "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macpools",
                            {redirect_address_id: serviceId},{},{token: tokenId});
                        ajax.finish(ret, function(data){

                        }, onErr);
                    }, onErr);
                }, onErr);
            },
            /**
             * 查询MacPools
             */
            queryMacPools: function (serviceId, onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macpools",
                        {redirect_address_id: serviceId}, {},{token: data.id});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },
            /**
             * 查询MacRanges
             */
            queryMacRanges: function (serviceId,onOK, onErr) {
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
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macranges",
                        {redirect_address_id: serviceId},{},{token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },
            //删除macRange
            deleteMacRange: function (serviceId, rangeId, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    var ret = ajax.send("delete",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macranges/{macrange_id}",
                        {redirect_address_id: serviceId, macrange_id: rangeId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            },
            //删除macPool
            deleteMacPool: function (serviceId, poolId, onOK, onErr) {
                var ret = ajax.send("get",
                    "/goku/rest/v1.5/token",
                    {}, {"user-id": ajax.user().id});

                ajax.finish(ret, function (data) {
                    if (data === undefined) {
                        return;
                    }
                    var tokenId = data.id;
                    var projectId = data.projectId;
                    var ret = ajax.send("delete",
                        "/goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/macpools/{macpool_id}",
                        {redirect_address_id: serviceId, macpool_id: poolId}, {}, {token: tokenId});
                    ajax.finish(ret, onOK, onErr);
                }, onErr);
            }
        }

        return ajax;
    });