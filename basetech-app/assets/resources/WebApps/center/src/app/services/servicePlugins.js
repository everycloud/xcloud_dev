/**
 * 提供菜单注册的所有服务
 */
define(["app/services/rightConfig",
    "app/services/sceneConfig",
    "app/services/competitionConfig",
    "language/keyID"], function (RIGHT_CONFIG, SCENE_CONFIG,Competition, i18n) {
    "use strict";

    /*
     //节点说明
     text 节点文案
     type 菜单大类，对于顶级节点，主要用于点亮当前菜单大类
     state 点击动作目的地，叶子节点包含
     openState boolean 树枝节点是否需要有state，默认为第一个子节点的state
     children 子节点（树枝节点包含）
     right 该节点在哪些场景下可见，空数组表示，不需要场景控制，仅叶子节点需要设置该属性，父节点根据直接叶子节点是否可见来判定
     scene 该节点显示需要的权限id数组，空数组表示，不需要权限控制，仅叶子节点需要设置改属性，父节点根据直接叶子节点是否有权限来判定
     hide boolean  可优先手动是否暂时不显示，比如开发中的，自动计算发现该节点不可见的时候也为true
     */

    var plugins = [
        {
            //首页
            text: i18n.common_term_homePage_label || "首页",
            type: "home",
            state: "home",
            right: [],
            scene: []
        },
        {
            //服务
            text: i18n.service_term_service_label || "服务",
            type: "service",
            children: [
                {
                    //服务
                    text: i18n.service_term_service_label || "服务",
                    children: [
                        {
                            text: i18n.service_term_catalog_label || "服务目录",
                            state: "service.serviceManager",
                            right: [
                                RIGHT_CONFIG.role_role_add_option_catalogView_value.id
                            ],
                            scene: [
                                SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictServiceCenter.val
                            ]
                        }
                    ]
                },
                {
                    //申请
                    text: i18n.common_term_application_label || "申请",
                    children: [
                        {
                            text: i18n.common_term_allApplication_label || "所有申请",
                            state: "service.order.allApply",
                            right: [RIGHT_CONFIG.role_role_add_option_orderView_value.id],
                            scene: [
                                SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictServiceCenter.val
                            ]
                        },
                        {
                            text: i18n.service_term_doApproval_label || "待办审批",
                            state: "service.order.approval",
                            right: [
                                RIGHT_CONFIG.role_role_add_option_orderApproval_value.id
                            ],
                            scene: [
                                SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictServiceCenter.val
                            ]
                        }
                    ]
                },
                {
                    //云资源
                    text: i18n.cloud_term_cloudResource_label || "云资源",
                    type: "multiPool",
                    children: [
                        {
                            //云资源池
                            text: i18n.cloud_term_cloudPool_label || "云资源池",
                            state: "serviceMgr.multiPool",
                            right: [RIGHT_CONFIG.role_role_add_option_cloudPoolView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                            ]
                        },
                        {
                            //标签管理
                            text: i18n.cloud_term_tagManage_label || "标签管理",
                            state: "serviceMgr.label",
                            right: [RIGHT_CONFIG.cloud_term_tagManage_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val
                            ]
                        },
                        {
                            //应用模板
                            text: i18n.template_term_app_label || "应用模板",
                            state: "serviceMgr.appTemplate",
                            right: [RIGHT_CONFIG["template_term_app_label.312000"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                            ]
                        }
                    ]
                },
                {
                    //拓扑
                    text: i18n.sys_term_topo_label || "拓扑",
                    state: "vdcMgr.topo",
                    hide: true,
                    right: [RIGHT_CONFIG.sys_term_topo_label.id],
                    scene: [
                        SCENE_CONFIG.itAllInOne.val,
                        SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                        SCENE_CONFIG.ictAllInOne.val,
                        SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                    ]
                }
            ]
        },
        {
            //资源
            text: i18n.common_term_resource_label || "资源",
            type: "resources",
            children: [
                {
                    //导航
                    text: i18n.common_term_navigation_label || "导航",
                    state: "resources.navigation",
                    right: [
                        RIGHT_CONFIG.role_role_add_option_deviceHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_hypervisorHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_clusterHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_netPoolHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_vmTemplateHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_hypervisorView_value.id,
                        RIGHT_CONFIG.role_role_add_option_zoneHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_vmTemplateView_value.id,
                        RIGHT_CONFIG.role_role_add_option_softwareHandle_value.id,
                        RIGHT_CONFIG.role_role_add_option_isoHandle_value.id
                    ],
                    scene: [
                        SCENE_CONFIG.itAllInOne.val,
                        SCENE_CONFIG.itLocal.val
                    ]
                },
                {
                    //OpenStack管理
                    text: i18n.resource_term_openstackManage_label || "OpenStack管理",
                    type: "openStack",
                    children: [
                        {
                            //OpenStack实例
                            text: i18n.resource_term_openstack_label || "OpenStack实例",
                            state: "resources.openStackResource.region",
                            right: [],
                            scene: [
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            //镜像
                            text: i18n.common_term_image_label || "镜像",
                            state: "resources.openStackResource.image",
                            right: [],
                            scene: [
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        }
                    ]
                },
                {
                    //设备
                    text: i18n.device_term_device_label || "设备",
                    type: "device",
                    children: [
                        {
                            //计算设备
                            text: i18n.device_term_compute_label || "计算设备",
                            children: [
                                {
                                    //服务器
                                    text: i18n.device_term_servers_label || "服务器",
                                    state: "resources.device.host",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                },
                                {
                                    //机框
                                    text: i18n.device_term_subracks_label || "机框",
                                    state: "resources.device.rack",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //网络设备
                            text: i18n.device_term_net_label || "网络设备",
                            children: [
                                {
                                    //交换机
                                    text: i18n.device_term_switchs_label || "交换机",
                                    state: "resources.device.switch",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                },
                                {
                                    //防火墙
                                    text: i18n.device_term_firewall_label || "防火墙",
                                    state: "resources.device.firewall",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //负载均衡
                                    text: i18n.common_term_lb_label || "负载均衡",
                                    state: "resources.device.balance",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //存储设备
                            text: i18n.common_term_storageDevice_label || "存储设备",
                            children: [
                                {
                                    //SAN
                                    text: i18n.device_term_san_label || "SAN",
                                    state: "resources.device.san",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                },
                                {
                                    //fusion storage
                                    text: "FusionStorage",
                                    state: "resources.device.fs",
                                    hide: false,
                                    right: [RIGHT_CONFIG.role_role_add_option_FusionStorageView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //物理位置
                            text: i18n.device_term_physiLocation_label || "物理位置",
                            onlyLeftBar: true,
                            children: [
                                {
                                    //机房
                                    text: i18n.device_term_rooms_label || "机房",
                                    state: "resources.device.room",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                },
                                {
                                    //机柜
                                    text: i18n.device_term_cabinets_label || "机柜",
                                    state: "resources.device.cabinet",
                                    right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val,
                                        SCENE_CONFIG.ictAllInOne.val,
                                        SCENE_CONFIG.ictLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //适配包管理
                            text: i18n.device_term_adaptorManage_label || "适配包管理",
                            onlyLeftBar: true,
                            state: "resources.device.adaptation",
                            right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            //物理设备导入
                            text: i18n.device_term_connectBatch_label || "物理设备导入",
                            onlyLeftBar: true,
                            state: "resources.device.import",
                            right: [RIGHT_CONFIG.role_role_add_option_deviceView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        }
                    ]
                },
                {
                    //虚拟化
                    text: i18n.common_term_virtualization_label || "虚拟化",
                    type: "hypervisor",
                    children: [
                        {
                            //虚拟化环境
                            text: i18n.virtual_term_hypervisor_label || "虚拟化环境",
                            state: "resources.hypervisor.environment",
                            right: [RIGHT_CONFIG["role_role_add_option_hypervisorView_value"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //资源集群
                            text: i18n.virtual_term_clusters_label || "资源集群",
                            state: "resources.hypervisor.cluster",
                            right: [RIGHT_CONFIG["role_role_add_option_clusterView_value"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //资源池
                    text: i18n.resource_term_pool_label || "资源池",
                    type: "rpool",
                    children: [
                        {
                            //资源分区
                            text: i18n.resource_term_zones_label || "资源分区",
                            state: "resources.rpool.zone",
                            right: [RIGHT_CONFIG["role_role_add_option_zoneView_value"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //模板和规格
                    text: i18n.template_term_templateAndSpec_label || "模板和规格",
                    type: "templateSpec",
                    children: [
                        {
                            //虚拟机模板
                            text: i18n.template_term_vms_label || "虚拟机模板",
                            state: "resources.templateSpec.vmTemplateResources.vmTemplate",
                            right: [RIGHT_CONFIG.template_term_vm_label.id, RIGHT_CONFIG.template_term_vmLogic_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //软件包
                            text: i18n.template_term_softwares_label || "软件包",
                            state: "resources.templateSpec.software",
                            right: [RIGHT_CONFIG.template_term_software_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //脚本
                            text: i18n.template_term_script_label || "脚本",
                            state: "resources.templateSpec.script",
                            right: [RIGHT_CONFIG.template_term_script_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //虚拟机规格
                            text: i18n.spec_term_vm_label || "虚拟机规格",
                            type: "specification",
                            state: "resources.templateSpec.vmSpec",
                            right: [RIGHT_CONFIG.spec_term_vm_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //安全组
                    text: i18n.security_term_SG_label || "安全组",
                    state: "vdcMgr.CT.groupCT",
                    right: [],
                    scene: [
                        // 电信比拼测试开启请屏蔽下行
                        "CT"
                    ]
                }
            ]
        },
        {
            //桌面云
            text: i18n.sys_term_desktop_label || "桌面云",
            type: "vdi",
            state: "vdi",
            hide: true,
            right: [RIGHT_CONFIG.sys_term_desktopAddr_label.id],
            scene: [
                SCENE_CONFIG.itAllInOne.val,
                SCENE_CONFIG.itLocal.val
            ]
        },
        {
            //VDC
            text: i18n.org_term_vdc_label || "VDC",
            type: "vdcMgr",
            children: [
                {
                    //VDC
                    text: i18n.org_term_vdc_label || "VDC",
                    children: [
                        {
                            //VDC管理
                            text: i18n.org_term_vdcManage_label || "VDC管理",
                            state: "vdcMgr.vdc.vdcList",
                            right: [RIGHT_CONFIG.role_role_add_option_orgView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                            ]
                        },
                        {
                            //VDC资源统计
                            text: i18n.perform_term_VDCresourceStatistic_label || "VDC资源统计",
                            state: "vdcMgr.vdc.vdcStatisticList",
                            hide: true,
                            right: [RIGHT_CONFIG.org_term_organization_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                            ]
                        },
                        {
                            //组织VDC
                            text: i18n.org_term_orgVDC_label || "组织VDC",
                            state: "vdcMgr.vdc.orgVdc",
                            hide: false,
                            right: [RIGHT_CONFIG.role_role_add_option_orgVDCView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val
                            ]
                        },
                        {
                            //虚拟机
                            text: i18n.common_term_vms_label || "虚拟机",
                            state: "vdcMgr.vdc.vm",
                            right: [RIGHT_CONFIG.common_term_check_button.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //虚拟机
                            text: i18n.common_term_vms_label || "虚拟机",
                            state: "vdcMgr.vdc.server",
                            right: [],
                            scene: [
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            //磁盘
                            text: i18n.common_term_disks_label || "磁盘",
                            state: "vdcMgr.vdc.disk",
                            right: [RIGHT_CONFIG["role_role_add_option_diskView_value"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //磁盘
                            text: i18n.common_term_disks_label || "磁盘",
                            state: "vdcMgr.vdc.volumes",
                            right: [],
                            scene: [
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            text: i18n.org_term_entrustedMgmtEntitlement_label || "代管授权",
                            state: "vdcMgr.vdc.authority",
                            right: [
                                RIGHT_CONFIG.vpc_term_vpc_label.id
                            ],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val, SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //VPC
                    text: i18n.vpc_term_vpc_label || "VPC",
                    children: [
                        {
                            //概览
                            text: i18n.common_term_overview_label || "概览",
                            onlyLeftBar: true,
                            state: "vdcMgr.network.summary",
                            right: [
                                RIGHT_CONFIG.vpc_term_vpc_label.id
                            ],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            //网络资源
                            text: i18n.resource_term_netResource_label || "网络资源",
                            children: [
                                {
                                    //网络
                                    text: i18n.vpc_term_nets_label || "网络",
                                    state: "vdcMgr.network.list",
                                    right: [
                                        RIGHT_CONFIG.vpc_term_net_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //路由器
                                    text: i18n.router_term_router_label || "路由器",
                                    state: "vdcMgr.network.router",
                                    right: [
                                        RIGHT_CONFIG.router_term_router_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //弹性IP
                                    text: i18n.eip_term_eips_label || "弹性IP",
                                    state: "vdcMgr.network.eip",
                                    right: [
                                        RIGHT_CONFIG.eip_term_eip_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //DNAT
                                    text: i18n.nat_term_dnat_label || "DNAT",
                                    state: "vdcMgr.network.dnat",
                                    right: [
                                        RIGHT_CONFIG.nat_term_dnat_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //安全
                            text: i18n.common_term_security_label || "安全",
                            onlyLeftBar: false,
                            children: [
                                {
                                    //ACLs
                                    text: i18n.acl_term_acl_label || "ACLs",
                                    state: "vdcMgr.security.acls",
                                    right: [
                                        RIGHT_CONFIG.acl_term_acl_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //安全组
                                    text: i18n.security_term_SGs_label || "安全组",
                                    state: "vdcMgr.security.group",
                                    right: [
                                        RIGHT_CONFIG.security_term_SG_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //应用层包过滤
                                    text: i18n.aspf_term_aspf_label || "应用层包过滤",
                                    state: "vdcMgr.security.app",
                                    right: [
                                        RIGHT_CONFIG.aspf_term_aspf_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //VPN
                            text: i18n.vpn_term_vpn_label || "VPN",
                            onlyLeftBar: false,
                            children: [
                                {
                                    //VPN网关",
                                    text: i18n.vpn_term_vpnGateways_label || "VPN网关",
                                    state: "vdcMgr.vpn.gate",
                                    right: [
                                        RIGHT_CONFIG.vpn_term_vpn_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                },
                                {
                                    //VPN链接
                                    text: i18n.vpn_term_vpnConnect_label || "VPN链接",
                                    state: "vdcMgr.vpn.link",
                                    right: [
                                        RIGHT_CONFIG.vpn_term_vpn_label.id
                                    ],
                                    scene: [
                                        SCENE_CONFIG.itAllInOne.val,
                                        SCENE_CONFIG.itLocal.val
                                    ]
                                }
                            ]
                        },
                        {
                            //VPC规格
                            text: i18n.spec_term_vpc_label || "VPC规格",
                            state: "vdcMgr.vpc.vpcSpec",
                            right: [RIGHT_CONFIG.spec_term_vpc_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val
                            ]
                        },
                        {
                            //IP带宽模板
                            text: i18n.template_term_ipBandwidth_label || "IP带宽模板",
                            state: "vdcMgr.vpc.ipBW",
                            right: [
                                RIGHT_CONFIG.template_term_ipBandwidth_label.id
                            ],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //用户
            text: i18n.common_term_user_label || "用户",
            type: "userMgr",
            children: [
                {
                    //用户
                    text: i18n.common_term_user_label || "用户",
                    children: [
                        {
                            //用户管理
                            text: i18n.user_term_user_label || "用户管理",
                            state: "userMgr.user",
                            right: [RIGHT_CONFIG.user_term_user_label.id],
                            //all
                            scene: []
                        }
                    ]
                },
                {
                    //分权分域
                    text: i18n.common_term_rightAndArea_label || "分权分域",
                    children: [
                        {
                            //角色管理
                            text: i18n.role_term_role_label || "角色管理",
                            state: "userMgr.role",
                            right: [RIGHT_CONFIG.role_term_role_label.id],
                            //all
                            scene: []
                        },
                        {
                            //分域管理
                            text: i18n.domain_term_domain_label || "分域管理",
                            state: "userMgr.domain.user",
                            right: [RIGHT_CONFIG.domain_term_domain_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //安全认证
                    text: i18n.user_term_secuAuthentic_label || "安全认证",
                    children: [
                        {
                            //密码策略
                            text: i18n.user_term_pswPolicy_label || "密码策略",
                            state: "userMgr.passwordPolicy",
                            right: [RIGHT_CONFIG.user_term_pswPolicy_label.id],
                            //all
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //keystone配置
                            text: i18n.user_term_setkeystone_label || "keystone配置",
                            state: "userMgr.keystoneConfig",
                            right: [RIGHT_CONFIG.keystone_term_domain_label.id],
                            scene: [
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictTop.val, SCENE_CONFIG.ictServiceCenter.val, ,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //告警
            text: i18n.common_term_monitor_label || "告警",
            type: "monitor",
            children: [
                {
                    //告警
                    text: i18n.alarm_term_alarm_label || "告警",
                    children: [
                        {
                            //告警列表
                            text: i18n.common_term_alarmList_label || "告警列表",
                            state: "monitor.alarmlist",
                            right: [RIGHT_CONFIG.alarm_term_alarm_label.id],
                            scene: []
                        },
                        {
                            //告警设置
                            text: i18n.common_term_alarmSet_label || "告警设置",
                            state: "monitor.alarmsettings",
                            right: [RIGHT_CONFIG.alarm_term_alarm_label.id],
                            scene: []},
                        {
                            //告警统计
                            text: i18n.common_term_alarmStatistic_label || "告警统计",
                            state: "monitor.alarmstat",
                            right: [RIGHT_CONFIG.alarm_term_alarm_label.id],
                            scene: []
                        }
                    ]
                },
                {
                    //报表
                    text: i18n.report_term_report_label || "报表",
                    children: [
                        {
                            //系统报表
                            text: i18n.report_term_sysReport_label || "系统报表",
                            state: "monitor.systemReport",
                            right: [RIGHT_CONFIG.report_term_report_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]},
                        {
                            //自定义报表
                            text: i18n.report_term_customReport_label || "自定义报表",
                            state: "monitor.customReport",
                            right: [RIGHT_CONFIG.report_term_report_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        }
                    ]
                },
                {
                    //性能
                    text: i18n.perform_term_perform_label || "性能",
                    children: [
                        {
                            //监控视图
                            text: i18n.common_term_monitorView_label || "监控视图",
                            state: "monitor.view",
                            right: [RIGHT_CONFIG["perform_term_monitor_label.107001"].id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //系统
            text: i18n.sys_term_sysConfig_label || "系统",
            type: "system",
            children: [
                {
                    //系统配置
                    text: i18n.common_term_sysConfig_label || "系统配置",
                    children: [
                        {
                            //替换系统Logo
                            text: i18n.sys_term_logo_label || "系统LOGO",
                            state: "system.systemLogo",
                            right: [RIGHT_CONFIG.sys_term_logo_label.id],
                            scene: []
                        },
                        {
                            //系统超时时间
                            text: i18n.sys_term_timeoutTime_label || "系统超时时间",
                            state: "system.systemTime",
                            right: [RIGHT_CONFIG.role_role_add_option_timeoutView_value.id],
                            scene: []
                        },
                        {
                            //虚拟机启停间隔
                            text: i18n.sys_term_intervalStartStop_label || "虚拟机启停间隔",
                            state: "system.vmInterval",
                            right: [RIGHT_CONFIG.sys_term_vmInterval_Handle_label.id, RIGHT_CONFIG.sys_term_vmInterval_View_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //SNMP管理站
                            text: i18n.sys_term_snmp_label || "SNMP管理站",
                            state: "system.snmpManage",
                            right: [RIGHT_CONFIG.sys_term_snmp_label.id],
                            scene: []
                        },
                        {
                            //备份设定
                            text: i18n.sys_term_backupSet_label || "备份设定",
                            state: "system.backupSetting",
                            right: [RIGHT_CONFIG.sys_term_backupSet_label.id],
                            scene: []
                        },
                        {
                            //License管理
                            text: i18n.sys_term_licenseManage_label || "License管理",
                            state: "system.licenseManage",
                            right: [RIGHT_CONFIG.sys_term_license_label.id],
                            scene: []
                        },
                        {
                            //时间管理
                            text: i18n.sys_term_time_label || "时间管理",
                            state: "system.timeManage",
                            right: [RIGHT_CONFIG.sys_term_time_label.id],
                            scene: []
                        },
                        {
                            //容灾管理IP
                            text: i18n.resource_term_disasterMgtIP_label || "容灾管理IP",
                            state: "system.disasterManageIp",
                            right: [RIGHT_CONFIG.role_role_add_option_disasterCfgView_value.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //邮箱配置
                            text: i18n.alarm_term_EmailSet_label || "邮箱配置",
                            state: "system.mailServerConfig",
                            right: [RIGHT_CONFIG.alarm_term_alarm_label.id],
                            scene: []
                        },
                        {
                            //桌面云地址
                            text: i18n.sys_term_desktopAddr_label || "桌面云地址",
                            state: "system.vdiManage",
                            right: [RIGHT_CONFIG.sys_term_desktopAddr_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val
                            ]
                        },
                        {
                            //机机账号管理
                            text: i18n.sys_term_machineAccountMgmt_label || "机机账号管理",
                            state: "system.machineAccount",
                            right: [RIGHT_CONFIG.sys_term_machine_account_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.itTop.val, SCENE_CONFIG.itServiceCenter.val
                            ]
                        },
                        {
                            //管理IP地址
                            text: i18n.common_term_managerIP_label || "管理IP地址",
                            state: "system.ipManage",
                            right: [],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.itTop.val
                            ]
                        }
                    ]
                },
                {
                    //任务与日志
                    text: i18n.task_term_taskAndLog_label || "任务与日志",
                    children: [
                        {
                            //任务中心
                            text: i18n.task_term_taskCenter_label || "任务中心",
                            state: "system.taskCenter",
                            right: [RIGHT_CONFIG.task_term_task_label.id],
                            scene: [
                                SCENE_CONFIG.itAllInOne.val,
                                SCENE_CONFIG.itLocal.val,
                                SCENE_CONFIG.ictAllInOne.val,
                                SCENE_CONFIG.ictLocal.val
                            ]
                        },
                        {
                            //操作日志
                            text: i18n.log_term_operation_label || "操作日志",
                            state: "system.operatorLog",
                            right: [RIGHT_CONFIG.log_term_operation_label.id],
                            scene: []
                        }
                    ]
                }
            ]
        }
    ];

    var hasRights = function (privilegeList, rights) {
        return !rights || !rights.length || _.intersection(privilegeList, rights).length;
    };
    var needInScene = function (sceneList, scene) {
        return !sceneList || !sceneList.length || _.contains(sceneList, scene);
    };
    var createNode = function (node, scene, privilegeList) {
        var children = node.children;
        if (children) {
            var hide = true;
            for (var i = 0, len = children.length; i < len; i++) {
                children[i] = createNode(children[i], scene, privilegeList);
                //只要有一个子节点hide不为true，父节点的hide就不为true
                !node.hide && (hide = !!(hide && children[i].hide));
                //数字节点需要state的时候，拿第一个子节点的state使用
                !node.state && !children[i].hide && (node.state = children[i].state);
            }
            node.hide = hide;
        } else {
            var rightList = node.right || [];
            var sceneList = node.scene || [];
            var showByScene = needInScene(sceneList, scene);
            var showByRight = showByScene && hasRights(privilegeList, rightList);
            //sc安装方式暂时这样添加上
            if (!(showByRight && showByScene)) {
                node.hide = true;
            }
            if (Competition.isBaseOnVmware && node.state === "serviceMgr.appTemplate"){
                node.hide = true;
            }
        }
        return node;
    };

    //Register a service constructor, which will be invoked with new to create the service instance
    function ServicePlugins() {
        this.getPlugins = function (itOrIct, deployMode, privilegeList, optTree) {
            var menu = optTree || plugins;
            var scene = itOrIct + "_" + deployMode;
            for (var i = 0, len = menu.length; i < len; i++) {
                menu[i] = createNode(menu[i], scene, privilegeList);
            }
            return menu;
        };
    }

    return ServicePlugins;
});