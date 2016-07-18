define(["can/util/fixture/fixture"], function (fixture) {

    fixture({
        "GET /goku/rest/v1.5/token": function (original, response) {
            var res = {
                id: "tokenId",
                projectId: "projectTestId"
            }
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/endpoint": function (original, response) {
            var res = {
                "endpoint": [
                    {
                        "serviceId": "Id1",
                        "id": "serviceId1",
                        "serviceName": "nova",
                        "serviceUrl": "test serviceUrl1",
                        "regionName": "region"

                    },
                    {
                        "serviceId": "serviceId11",
                        "id": "serviceId11",
                        "serviceName": "nova2",
                        "serviceUrl": "serviceUrl11",
                        "regionName": "region"

                    },
                    {
                        "serviceId": "serviceId2",
                        "id": "serviceId1",
                        "serviceName": "cinder",
                        "serviceUrl": "serviceUrl2",
                        "regionName": "region"
                    },
                    {
                        "serviceId": "serviceId2",
                        "id": "serviceId1",
                        "serviceName": "neutron",
                        "serviceUrl": "serviceUrl2",
                        "regionName": "region"
                    }
                ]
            }
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/os-services": function (original, response) {
            var res = {
                "services": [
                    {
                        "zone": "shenzhen_AZ01",
                        "host": "host001",
                        "state": "up",
                        "status":"enabled"

                    },
                    {
                        "zone": "shenzhen_AZ01",
                        "host": "host002",
                        "state": "down",
                        "status":"disabled"
                    }
                ]
            }
            response(200, "success", res, {});
        },


        "GET /goku/rest/v1.5/openstack/{service_id}/v2/images": function (original, response) {
            var res = {
                "images": [
                    {
                        "name": "test zone",
                        "container_format": "test host001",
                        "status": "saving",
                        "disk_format": "iso",
                        "min_disk": 10,
                        "min_ram": "50",
                        "describe": "SUSE11 sp1 64bit"
                    }
                ]
            };
            response(200, "success", res, {});
        },
        "GET /goku/rest/v1.5/openstack/{serviceId}/v2/{projectId}/flavors/detail": function (original, response) {
            var res = {
                "flavors": [
                    {
                        "name": "default-vm",
                        "id": "236598",
                        "vcpus": "5",
                        "ram": "2048",
                        "disk": "500",
                        "OS-FLV-EXT-DATA:ephemeral": "250",
                        "swap": "4096"
                    }
                ]
            };
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/os-aggregates": function (original, response) {
            var res = {
                "aggregates": [
                    {
                        "name": "HostGroupA01",
                        "availability_zone": "shenzhen_AZ01",
                        "deleted": 0,
                        "created_at": "2013-06-29T03:06:21",
                        "updated_at": null,
                        "hosts": [],
                        "deleted_at": null,
                        "id": 1,
                        "metadata": {
                            "availability_zone": "shenzhen_AZ01"
                        }
                    },
                    {
                        "name": "HostGroupA02",
                        "availability_zone": "shenzhen_AZ01",
                        "deleted": 0,
                        "created_at": "2013-07-12T04:26:21",
                        "updated_at": null,
                        "hosts": [],
                        "deleted_at": null,
                        "id": 2,
                        "metadata": {
                            "availability_zone": "shenzhen_AZ01"
                        }
                    }
                ]
            }
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/os-aggregates/{aggregate_id}": function (original, response) {
            var res = {
                "aggregate": {
                    "name": "HostGroupA01",
                    "availability_zone": "shenzhen_AZ01",
                    "deleted": 0,
                    "created_at": "2013-06-29T03:06:21",
                    "updated_at": null,
                    "hosts": [
                        "host001", "host002", "host003", "host004", "host005", "host006"],
                    "deleted_at": null,
                    "id": 1,
                    "metadata": {
                        "availability_zone": "shenzhen_AZ01"
                    }
                }
            }
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v3/{vdc_id}/os-hosts/{host_id}/{opType}": function (original, response) {
            var res = {}
            response(200, "success", res, {});
        },

        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/volumes/detail?all_tenants=1": function (original, response) {
            var res = {
                "volumes": [
                    {
                        "id": "disk01",
                        "name": "disk01",
                        "description": "disk in xian",
                        "status": "error_deleting",
                        "size": "1024",
                        "volume_type": "Sharing",
                        "os-vol-host-attr:host": "host01",
                        "created_at": "2013-06-29T03:06:21"
                    }
                ]
            }
            response(200, "success", res, {});
        },
        "PUT /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/volumes/{volume_id}": function (original, response) {
            var res = {}
            response(200, "success", {}, {});
        },

        "DELETE /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/volumes/{volume_id}/action": function (original, response) {
            var res = {}
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks?shared=true": function (original, response) {
            var res = {
                "networks": [
                    {
                        "status": "ACTIVE",
                        "provider:segmentation_id": "test 1001",
                        "name": "test external-net-1",
                        "provider:network_type": "test vlan",
                        "provider:physical_network": "physical01",
                        "id": "9d83c053-b0a4-4682-ae80-c00df269ce0a",
                        "shared": false,
                        "router:external":true
                    },
                    {
                        "status": "ACTIVE",
                        "provider:segmentation_id": "1002",
                        "name": "external-net-2",
                        "provider:network_type": "vxlan",
                        "provider:physical_network": "physical02",
                        "id": "9d83c053-b0a4-4682-ae80-c00df269ce0b",
                        "shared": false,
                        "router:external":true
                    }
                ]
            }
            response(200, "success", res, {});
        },
        "POST /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/networks/{network_id}": function (original, response) {
            var res = {}
            response(200, "success", {}, {});
        },
        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets": function (original, response) {
            var res = {
                "subnets": [
                    {
                        "allocation_pools": [
                            {
                                "end": "192.168.0.50",
                                "start": "192.168.0.10"
                            }
                        ],
                        "cidr": "192.168.0.0/24",
                        "dns_nameservers": [],
                        "enable_dhcp": true,
                        "gateway_ip": "192.168.0.1",
                        "host_routes": [],
                        "id": "6240cce0-807b-424d-845e-a6f3e5540d4a",
                        "ip_version": 4,
                        "name": "",
                        "network_id": "test 5798c830-f6d9-43c6-868f-b6fb8a53fdc8",
                        "vdc_id": ""
                    }
                ]
            }
            response(200, "success", res, {});
        },
        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{projectId}/servers/detail?all_tenants=1": function (original, response) {
            var res = {
                "servers": [

                    {
                        "name":"VM_A01",
                        "status": "ACTIVE",
                        "id": "5230bbc0-237c-252d-125e-235de5540d4a",
                        "taskStatus":"START",
                        "powerStatus":"POWER ON",
                        "ip":"191.100.72.227",
                        "created":"2014-7-8 7:05:35",
                        "OS-EXT-AZ:availability_zone":"shenzhen_AZ01",
                        "OS-EXT-SRV-ATTR:hypervisor_hostname":"host01",
                        "tenant_id":"4000000126251"
                    },
                    {
                        "name":"VM_A02",
                        "status": "SHUTOFF",
                        "id": "6240cce0-807b-424d-845e-a6f3e5540d4a",
                        "taskStatus":"START",
                        "powerStatus":"POWER OFF",
                        "ip":"191.100.71.217",
                        "created":"2014-7-10 8:25:37",
                        "OS-EXT-AZ:availability_zone":"shenzhen_AZ01",
                        "OS-EXT-SRV-ATTR:hypervisor_hostname":"host01",
                        "tenant_id":"5002500126354"
                    },
                    {
                        "name":"VM_A03",
                        "status": "OTHER",
                        "id": "3371hce0-709a-336s-669f-56sdfv540d4a",
                        "taskStatus":"START",
                        "powerStatus":"POWER OFF",
                        "ip":"191.100.71.232",
                        "created":"2014-7-13 6:12:7",
                        "OS-EXT-AZ:availability_zone":"shenzhen_AZ01",
                        "OS-EXT-SRV-ATTR:hypervisor_hostname":"host01",
                        "tenant_id":"2369800115247"
                    }
                ]
            }
            response(200, "success", res, {});
        },
        "GET /goku/rest/v1.5/openstack/{redirect_address_id}/v2/{vdc_id}/os-hypervisors/statistics": function (original, response) {
            var res = {
                "hypervisor_statistics": {
                    "count": 1,
                    "current_workload": 0,
                    "disk_available_least": 0,
                    "free_disk_gb": 1028,
                    "free_ram_mb": 7680,
                    "local_gb": 1028,
                    "local_gb_used": 0,
                    "memory_mb": 81920,
                    "memory_mb_used": 5120,
                    "running_vms": 0,
                    "vcpus": 1000,
                    "vcpus_used": 20
                }
            }

            response(200, "success", res, {});
        },
        "GET /goku/rest/v1.5/openstack/serviceId1/v2/1/servers/detail?all_tenants=1&host=host001&limit=10&name=": function (original, response) {
            var res = {
            "servers":[{"id":"c0448937-52f3-41b2-9dae-a867014e531c","name":"VM_A01","addresses":{"fdsafdsf_Router":[{"version":"4","addr":"191.100.71.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:bb:36:8b","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.shenzhen_AZ01.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/c0448937-52f3-41b2-9dae-a867014e531c","type":null},{"rel":"bookmark","href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/c0448937-52f3-41b2-9dae-a867014e531c","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},
                "flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-10-09T08:53:49Z","created":"2014-10-09T08:53:43Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"5d1ae81c-ec25-490a-87d8-0e71feb2e687","vnic_type":"normal"}],"config_drive":"","tenant_id":"91b1c0cfea914f2faff9c6b8b7bbe31d","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"default"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000007","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"shenzhen_AZ01","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-10-09T08:53:48.983390"},{"id":"e348a823-d952-4d25-a273-87e8ed2e3796","name":"VM_A02","addresses":{"testtt":[{"version":"4","addr":"191.100.78.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:2b:5f:f5","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.az1.dc1.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/e348a823-d952-4d25-a273-87e8ed2e3796","type":null},{"rel":"bookmark","href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/e348a823-d952-4d25-a273-87e8ed2e3796","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.az1.dc1.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},"flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-10-09T08:50:54Z","created":"2014-10-09T08:50:48Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"90ff7ee4-3b93-487e-b25d-2909b9f11318","vnic_type":"normal"}],"config_drive":"","tenant_id":"359c7079583a4c8db42ebfc247f3c6a9","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"default"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000006","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"shenzhen_AZ01","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-10-09T08:50:54.157093"},{"id":"02e74b3b-3162-4729-bf88-d392b6a004df","name":"VM_A03","addresses":{"Router_net_dafdsf":[{"version":"4","addr":"191.100.71.2","OS-EXT-IPS-MAC:mac_addr":"fa:16:3e:26:42:9c","OS-EXT-IPS:type":"fixed"}]},"links":[{"rel":"self","href":"https://compute.shenzhen_AZ01.vodafone.com/v2/cd7a2afb30454349927b89ad5184f4f4/servers/02e74b3b-3162-4729-bf88-d392b6a004df","type":null},{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/servers/02e74b3b-3162-4729-bf88-d392b6a004df","type":null}],"image":{"id":"57bef05a-64a1-4305-b63b-ee63f4fe61f9","links":[{"href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/images/57bef05a-64a1-4305-b63b-ee63f4fe61f9","rel":"bookmark"}]},"flavor":{"id":"1","name":null,"vcpus":null,"ram":null,"disk":null,"swap":null,"links":[{"rel":"bookmark","href":"https://compute.shenzhen_AZ01.vodafone.com/cd7a2afb30454349927b89ad5184f4f4/flavors/1","type":null}],"OS-FLV-EXT-DATA:ephemeral":null,"rxtx_factor":null,"OS-FLV-DISABLED:disabled":null,"rxtx_quota":null,"rxtx_cap":null,"os-flavor-access:is_public":null},"accessIPv4":"","accessIPv6":"","status":"ACTIVE","progress":0,"fault":null,"hostId":"C415A22E-7271-11CF-8567-000000821800","updated":"2014-09-29T10:59:03Z","created":"2014-09-29T10:58:54Z","metadata":{"bootDev":"hd"},"uuid":null,"adminPass":null,"vcpuAffinity":["0"],"numaOpts":"0","hyperThreadAffinity":"any","networks":[{"bandwidth":"0","uuid":null,"fixed_ip":null,"port_id":"395d3b5c-3576-4a1f-bb5c-26ca56c20fee","vnic_type":"normal"}],"config_drive":"","tenant_id":"dd92796e0a6c436b9705602ffbfc090d","user_id":"53e958133608441a810a60515b3e1823","key_name":null,"security_groups":[{"name":"fdsafdsf"}],"OS-EXT-STS:task_state":null,"OS-EXT-STS:power_state":"1","OS-EXT-STS:vm_state":"active","OS-EXT-SRV-ATTR:host":"C415A22E-7271-11CF-8567-000000821800","OS-EXT-SRV-ATTR:instance_name":"instance-00000001","OS-EXT-SRV-ATTR:hypervisor_hostname":"C415A22E-7271-11CF-8567-000000821800","OS-DCF:diskConfig":"MANUAL","OS-EXT-AZ:availability_zone":"az1.dc1","OS-SRV-USG:terminated_at":null,"os-extended-volumes:volumes_attached":[],"OS-SRV-USG:launched_at":"2014-09-29T10:59:03.338403"}],"servers_links":null}

            response(200, "success", res, {});
        },
        "POST /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets": function (original, response) {
            response(200, "success", {}, {});
        },
        "DELETE /goku/rest/v1.5/openstack/{redirect_address_id}/v2.0/subnets/{subnet_id}": function (original, response) {
            var res = {}
            response(200, "success", {}, {});
        }
    });

    return fixture;
});
